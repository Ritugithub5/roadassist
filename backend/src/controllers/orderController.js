import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { createNotification } from './notificationController.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Place order (any logged-in user)
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMode } = req.body

    if (!items || items.length === 0) {
      return errorResponse(res, 400, 'No items in cart')
    }

    if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.city) {
      return errorResponse(res, 400, 'Shipping address is incomplete')
    }

    const productIds = items.map((i) => i.product)
    const products = await Product.find({ _id: { $in: productIds } })

    if (products.length !== productIds.length) {
      return errorResponse(res, 400, 'Some products not found')
    }

    if (products.some((p) => p.seller.toString() === req.user._id.toString())) {
      return errorResponse(res, 400, 'You cannot buy your own products')
    }

    const sellerIds = [...new Set(products.map((p) => p.seller.toString()))]
    if (sellerIds.length > 1) {
      return errorResponse(
        res,
        400,
        'Cart can only contain products from one seller'
      )
    }

    const orderItems = items.map((i) => {
      const product = products.find((p) => p._id.toString() === i.product)
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        qty: i.qty,
        emoji: product.emoji,
      }
    })

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal > 999 ? 0 : 49
    const tax = Math.round(subtotal * 0.18)
    const total = subtotal + shipping + tax

    const order = await Order.create({
      buyer: req.user._id,
      seller: sellerIds[0],
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMode: paymentMode || 'COD',
    })

    // Decrement stock + increment sold
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty, sold: item.qty },
      })
    }

    // 🔔 Notify seller
    await createNotification({
      userId: sellerIds[0],
      title: '📦 New order received',
      message: `New order ${order.orderId} for ₹${order.total.toLocaleString()}`,
      type: 'payment',
      link: '/seller/orders',
    })

    // 🔔 Notify buyer
    await createNotification({
      userId: req.user._id,
      title: '✅ Order placed',
      message: `Order ${order.orderId} placed successfully. Track it in your orders.`,
      type: 'payment',
      link: '/dashboard',
    })

    return successResponse(res, 201, 'Order placed successfully', order)
  } catch (error) {
    next(error)
  }
}

// @desc    Get my orders (buyer)
// @route   GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('seller', 'name city email phone')
      .sort({ createdAt: -1 })

    return successResponse(res, 200, 'Your orders fetched', orders)
  } catch (error) {
    next(error)
  }
}

// @desc    Get seller orders
// @route   GET /api/orders/seller
export const getSellerOrders = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = { seller: req.user._id }
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .populate('buyer', 'name phone email city')
      .sort({ createdAt: -1 })

    return successResponse(res, 200, 'Seller orders fetched', orders)
  } catch (error) {
    next(error)
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone email')
      .populate('seller', 'name city email phone')

    if (!order) return errorResponse(res, 404, 'Order not found')

    const isBuyer = order.buyer._id.toString() === req.user._id.toString()
    const isSeller = order.seller._id.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isBuyer && !isSeller && !isAdmin) {
      return errorResponse(res, 403, 'Not authorized to view this order')
    }

    return successResponse(res, 200, 'Order fetched', order)
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status (seller)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) return errorResponse(res, 404, 'Order not found')
    if (order.seller.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }

    order.status = status
    if (status === 'Delivered') order.deliveredAt = new Date()
    await order.save()

    // 🔔 Notify buyer about status change
    const statusMessages = {
      Confirmed: '📋 Your order has been confirmed by the seller.',
      Shipped: '🚚 Your order has been shipped!',
      Delivered: '🎉 Your order has been delivered. Enjoy!',
      Cancelled: '❌ Your order was cancelled.',
    }

    await createNotification({
      userId: order.buyer,
      title: `Order ${status}`,
      message:
        statusMessages[status] ||
        `Your order ${order.orderId} is now ${status}.`,
      type: 'payment',
      link: '/dashboard',
    })

    return successResponse(res, 200, 'Order status updated', order)
  } catch (error) {
    next(error)
  }
}

// @desc    Seller earnings
// @route   GET /api/orders/seller/earnings
export const getSellerEarnings = async (req, res, next) => {
  try {
    const orders = await Order.find({
      seller: req.user._id,
      status: { $in: ['Delivered', 'Shipped'] },
    }).sort({ createdAt: -1 })

    const totalRevenue = orders.reduce((s, o) => s + o.subtotal, 0)
    const commission = Math.round(totalRevenue * 0.1)
    const netEarnings = totalRevenue - commission

    const thisMonth = orders.filter((o) => {
      const d = new Date(o.createdAt)
      const now = new Date()
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      )
    })
    const monthRevenue = thisMonth.reduce((s, o) => s + o.subtotal, 0)

    return successResponse(res, 200, 'Earnings fetched', {
      totalOrders: orders.length,
      totalRevenue,
      commission,
      netEarnings,
      thisMonthOrders: thisMonth.length,
      thisMonthRevenue: monthRevenue,
      recentOrders: orders.slice(0, 10),
    })
  } catch (error) {
    next(error)
  }
}
import User from '../models/User.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get seller profile
// @route   GET /api/sellers/me
export const getSellerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    // Stats
    const [totalProducts, totalOrders, revenueAgg] = await Promise.all([
      Product.countDocuments({ seller: req.user._id, isActive: true }),
      Order.countDocuments({ seller: req.user._id }),
      Order.aggregate([
        { $match: { seller: req.user._id, status: { $in: ['Delivered', 'Shipped'] } } },
        { $group: { _id: null, total: { $sum: '$subtotal' } } },
      ]),
    ])
    const totalRevenue = revenueAgg[0]?.total || 0

    return successResponse(res, 200, 'Seller profile fetched', {
      user,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update seller profile
// @route   PUT /api/sellers/me
export const updateSellerProfile = async (req, res, next) => {
  try {
    const allowed = [
      'name',
      'phone',
      'city',
      'businessName',
      'gstNumber',
      'address',
      'about',
    ]
    const updates = {}
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    })

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password')

    return successResponse(res, 200, 'Profile updated', user)
  } catch (error) {
    next(error)
  }
}
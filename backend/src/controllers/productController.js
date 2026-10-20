import Product from '../models/Product.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get all active products (public)
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, seller } = req.query
    const filter = { isActive: true }
    if (category && category !== 'all') filter.category = category
    if (seller) filter.seller = seller
    if (search) filter.$text = { $search: search }

    const products = await Product.find(filter)
      .populate('seller', 'name city')
      .sort({ createdAt: -1 })
      .limit(100)

    return successResponse(res, 200, 'Products fetched', products)
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name city email phone'
    )
    if (!product) return errorResponse(res, 404, 'Product not found')
    return successResponse(res, 200, 'Product fetched', product)
  } catch (error) {
    next(error)
  }
}

// @desc    Get my products (seller)
// @route   GET /api/products/seller/me
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    })
    return successResponse(res, 200, 'Your products fetched', products)
  } catch (error) {
    next(error)
  }
}

// @desc    Add product (seller)
// @route   POST /api/products
export const addProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
    })
    return successResponse(res, 201, 'Product added', product)
  } catch (error) {
    next(error)
  }
}

// @desc    Update product (seller — own only)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return errorResponse(res, 404, 'Product not found')
    if (product.seller.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    return successResponse(res, 200, 'Product updated', updated)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return errorResponse(res, 404, 'Product not found')
    if (product.seller.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }

    await product.deleteOne()
    return successResponse(res, 200, 'Product deleted')
  } catch (error) {
    next(error)
  }
}
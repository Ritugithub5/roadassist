import Brand from '../models/Brand.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get all active brands
// @route   GET /api/brands
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ order: 1 })
    return successResponse(res, 200, 'Brands fetched', brands)
  } catch (error) {
    next(error)
  }
}

// @desc    Create brand (admin)
// @route   POST /api/brands
export const createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body)
    return successResponse(res, 201, 'Brand created', brand)
  } catch (error) {
    next(error)
  }
}

// @desc    Update brand
export const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!brand) return errorResponse(res, 404, 'Brand not found')
    return successResponse(res, 200, 'Brand updated', brand)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete brand
export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    if (!brand) return errorResponse(res, 404, 'Brand not found')
    return successResponse(res, 200, 'Brand deleted')
  } catch (error) {
    next(error)
  }
}
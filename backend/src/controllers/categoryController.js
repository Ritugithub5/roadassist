import Category from '../models/Category.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get all active categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 })
    return successResponse(res, 200, 'Categories fetched', categories)
  } catch (error) {
    next(error)
  }
}

// @desc    Create category (admin)
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body)
    return successResponse(res, 201, 'Category created', cat)
  } catch (error) {
    next(error)
  }
}

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!cat) return errorResponse(res, 404, 'Category not found')
    return successResponse(res, 200, 'Category updated', cat)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id)
    if (!cat) return errorResponse(res, 404, 'Category not found')
    return successResponse(res, 200, 'Category deleted')
  } catch (error) {
    next(error)
  }
}
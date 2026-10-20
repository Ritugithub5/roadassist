import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get own profile
// @route   GET /api/users/me
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    return successResponse(res, 200, 'Profile fetched', user)
  } catch (error) {
    next(error)
  }
}

// @desc    Update own profile
// @route   PUT /api/users/me
export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'city', 'avatar']
    const updates = {}
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    })

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
    return successResponse(res, 200, 'Profile updated', user)
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/users/me/password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, 'Both passwords required')
    }
    if (newPassword.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters')
    }

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return errorResponse(res, 401, 'Current password is incorrect')
    }

    user.password = newPassword
    await user.save()

    return successResponse(res, 200, 'Password updated successfully')
  } catch (error) {
    next(error)
  }
}
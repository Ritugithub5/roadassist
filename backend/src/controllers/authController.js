import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import { createNotification } from './notificationController.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, city } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return errorResponse(res, 400, 'Email already registered')
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'driver',
      city,
      status:
        role === 'mechanic' || role === 'seller'
          ? 'Pending Verification'
          : 'Active',
    })

    const token = generateToken(user._id, user.role)

    // 🔔 Welcome notification
    const welcomeMessages = {
      driver: `Hi ${user.name.split(' ')[0]}, add a vehicle to get started.`,
      mechanic:
        'Your profile is under review. We\'ll verify your account shortly.',
      seller: 'Your seller account is under review.',
    }

    await createNotification({
      userId: user._id,
      title: '👋 Welcome to RoadAssist!',
      message:
        welcomeMessages[user.role] ||
        'Your account is ready. Let\'s get started!',
      type: 'system',
      link:
        user.role === 'mechanic'
          ? '/mechanic'
          : user.role === 'seller'
          ? '/seller'
          : '/dashboard',
    })

    return successResponse(res, 201, 'Registration successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        status: user.status,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials')
    }

    if (user.status === 'Suspended') {
      return errorResponse(res, 403, 'Account suspended. Contact support.')
    }

    const token = generateToken(user._id, user.role)

    return successResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        status: user.status,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    return successResponse(res, 200, 'User fetched', user)
  } catch (error) {
    next(error)
  }
}
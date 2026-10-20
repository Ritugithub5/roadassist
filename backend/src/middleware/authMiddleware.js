import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { errorResponse } from '../utils/apiResponse.js'

export const protect = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return errorResponse(res, 401, 'Not authorized, no token')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return errorResponse(res, 401, 'User not found')
    }

    if (req.user.status === 'Suspended') {
      return errorResponse(res, 403, 'Account suspended. Contact support.')
    }

    next()
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized, token failed')
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Role '${req.user.role}' is not allowed to access this route`
      )
    }
    next()
  }
}
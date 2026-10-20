import express from 'express'
import {
  createQuote,
  getAllQuotes,
  getMyQuotes,
  updateQuoteStatus,
  getQuoteById,
} from '../controllers/insuranceController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// ✅ Optional auth — attaches user if token provided, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    }
  } catch (err) {
    // Ignore invalid tokens for public routes
  }
  next()
}

// Public — anyone can request a quote (logged in or guest)
router.post('/quotes', optionalAuth, createQuote)

// Get quote by ID (public with quoteId)
router.get('/quotes/:id', getQuoteById)

// Private — logged-in user's quotes
router.get('/quotes/my/list', protect, getMyQuotes)

// Admin only
router.get('/quotes', protect, authorize('admin'), getAllQuotes)
router.put('/quotes/:id', protect, authorize('admin'), updateQuoteStatus)

export default router
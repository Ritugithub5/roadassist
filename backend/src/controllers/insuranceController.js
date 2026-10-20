import InsuranceQuote from '../models/InsuranceQuote.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Submit insurance quote request
// @route   POST /api/insurance/quotes
// @access  Public (optional auth)
export const createQuote = async (req, res, next) => {
  try {
    const { name, phone, email, brand, model, regNumber, plan } = req.body

    // Validation
    if (!name || !phone) {
      return errorResponse(res, 400, 'Name and phone are required')
    }
    if (!/^\d{10}$/.test(phone)) {
      return errorResponse(res, 400, 'Phone must be 10 digits')
    }

    // Build payload — attach user if logged in
    const payload = {
      name: name.trim(),
      phone,
      email: email?.trim() || '',
      brand: brand?.trim() || '',
      model: model?.trim() || '',
      regNumber: regNumber?.toUpperCase().trim() || '',
      plan: plan || 'any',
    }

    // Check if request has user (from optional auth middleware)
    if (req.user) {
      payload.user = req.user._id
    }

    const quote = await InsuranceQuote.create(payload)

    return successResponse(res, 201, 'Quote request submitted successfully', {
      quoteId: quote.quoteId,
      name: quote.name,
      phone: quote.phone,
      plan: quote.plan,
      status: quote.status,
      createdAt: quote.createdAt,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all quotes (admin)
// @route   GET /api/insurance/quotes
// @access  Private/Admin
export const getAllQuotes = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const quotes = await InsuranceQuote.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })

    return successResponse(res, 200, 'Quotes fetched', quotes)
  } catch (error) {
    next(error)
  }
}

// @desc    Get my quotes
// @route   GET /api/insurance/quotes/my
// @access  Private
export const getMyQuotes = async (req, res, next) => {
  try {
    const quotes = await InsuranceQuote.find({ user: req.user._id }).sort({
      createdAt: -1,
    })
    return successResponse(res, 200, 'My quotes fetched', quotes)
  } catch (error) {
    next(error)
  }
}

// @desc    Update quote status (admin)
// @route   PUT /api/insurance/quotes/:id
// @access  Private/Admin
export const updateQuoteStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const quote = await InsuranceQuote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!quote) return errorResponse(res, 404, 'Quote not found')
    return successResponse(res, 200, 'Quote updated', quote)
  } catch (error) {
    next(error)
  }
}

// @desc    Get quote by ID
// @route   GET /api/insurance/quotes/:id
// @access  Public (by quoteId) or Private
export const getQuoteById = async (req, res, next) => {
  try {
    const quote = await InsuranceQuote.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { quoteId: req.params.id },
      ],
    })
    if (!quote) return errorResponse(res, 404, 'Quote not found')
    return successResponse(res, 200, 'Quote fetched', quote)
  } catch (error) {
    next(error)
  }
}
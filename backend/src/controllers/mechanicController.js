import Mechanic from '../models/Mechanic.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get all mechanics
// @route   GET /api/mechanics
export const getMechanics = async (req, res, next) => {
  try {
    const mechanics = await Mechanic.find({ isOnline: true })
      .populate('user', 'name email phone city rating status')
      .limit(50)
    return successResponse(res, 200, 'Mechanics fetched', mechanics)
  } catch (error) {
    next(error)
  }
}

// @desc    Get mechanic profile
// @route   GET /api/mechanics/me
export const getMyProfile = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone city'
    )
    if (!mechanic) return errorResponse(res, 404, 'Mechanic profile not found')
    return successResponse(res, 200, 'Profile fetched', mechanic)
  } catch (error) {
    next(error)
  }
}

// @desc    Create/Update mechanic profile
// @route   PUT /api/mechanics/me
export const upsertProfile = async (req, res, next) => {
  try {
    let mechanic = await Mechanic.findOne({ user: req.user._id })
    if (mechanic) {
      mechanic = await Mechanic.findOneAndUpdate({ user: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      })
    } else {
      mechanic = await Mechanic.create({ ...req.body, user: req.user._id })
    }
    return successResponse(res, 200, 'Profile saved', mechanic)
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle online
// @route   PUT /api/mechanics/me/online
export const toggleOnline = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id })
    if (!mechanic) return errorResponse(res, 404, 'Profile not found')
    mechanic.isOnline = !mechanic.isOnline
    await mechanic.save()
    return successResponse(res, 200, 'Status toggled', { isOnline: mechanic.isOnline })
  } catch (error) {
    next(error)
  }
}

// @desc    Get nearby mechanics
// @route   GET /api/mechanics/nearby
export const getNearbyMechanics = async (req, res, next) => {
  try {
    const mechanics = await Mechanic.find({ isOnline: true })
      .populate('user', 'name phone city rating avatar')
      .limit(20)
    return successResponse(res, 200, 'Nearby mechanics fetched', mechanics)
  } catch (error) {
    next(error)
  }
}

// @desc    Get single mechanic detail
// @route   GET /api/mechanics/:id
export const getMechanicById = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id).populate(
      'user',
      'name email phone city avatar'
    )
    if (!mechanic) return errorResponse(res, 404, 'Mechanic not found')
    return successResponse(res, 200, 'Mechanic fetched', mechanic)
  } catch (error) {
    next(error)
  }
}

// @desc    Update service offerings
// @route   PUT /api/mechanics/me/services
export const updateServices = async (req, res, next) => {
  try {
    const { services } = req.body
    if (!Array.isArray(services)) {
      return errorResponse(res, 400, 'Services must be an array')
    }

    const mechanic = await Mechanic.findOneAndUpdate(
      { user: req.user._id },
      { services },
      { new: true }
    )
    if (!mechanic) return errorResponse(res, 404, 'Mechanic profile not found')
    return successResponse(res, 200, 'Services updated', mechanic)
  } catch (error) {
    next(error)
  }
}

// @desc    Update availability schedule
// @route   PUT /api/mechanics/me/availability
export const updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body
    const mechanic = await Mechanic.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true }
    )
    if (!mechanic) return errorResponse(res, 404, 'Mechanic profile not found')
    return successResponse(res, 200, 'Availability updated', mechanic)
  } catch (error) {
    next(error)
  }
}

// @desc    Get earnings summary
// @route   GET /api/mechanics/me/earnings
export const getEarnings = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id })
    if (!mechanic) return errorResponse(res, 404, 'Mechanic profile not found')

    const jobs = await ServiceRequest.find({
      mechanic: req.user._id,
      status: 'Completed',
    }).sort({ completedAt: -1 })

    const totalEarnings = jobs.reduce((sum, j) => sum + (j.total || 0), 0)
    const thisMonth = jobs.filter((j) => {
      const d = new Date(j.completedAt || j.updatedAt)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const thisMonthEarnings = thisMonth.reduce((sum, j) => sum + (j.total || 0), 0)

    return successResponse(res, 200, 'Earnings fetched', {
      totalJobs: jobs.length,
      totalEarnings,
      thisMonthJobs: thisMonth.length,
      thisMonthEarnings,
      recentJobs: jobs.slice(0, 10),
    })
  } catch (error) {
    next(error)
  }
}
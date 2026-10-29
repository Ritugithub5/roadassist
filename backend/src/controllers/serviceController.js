import ServiceRequest from '../models/ServiceRequest.js'
import User from '../models/User.js'
import Mechanic from '../models/Mechanic.js'
import { createNotification } from './notificationController.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Create service request
// @route   POST /api/services
export const createRequest = async (req, res, next) => {
  try {
    // ✅ Force status to 'Requested' (Pending). Do NOT auto-accept.
    const data = {
      ...req.body,
      user: req.user._id,
      mechanic:
        req.body.preferredMechanic && req.body.preferredMechanic !== 'auto'
          ? req.body.preferredMechanic
          : null,
      status: 'Requested', 
    }

    const service = await ServiceRequest.create(data)

    await createNotification({
      userId: req.user._id,
      title: '🚗 Request created',
      message: `Your ${service.serviceType} request is now live.`,
      type: 'job',
      link: `/track/${service._id}`,
    })

    if (data.mechanic) {
      await createNotification({
        userId: data.mechanic,
        title: '🔧 New job assigned',
        message: `You have a new ${service.serviceType} request. Please accept it.`,
        type: 'job',
        link: '/mechanic',
      })
    }

    return successResponse(res, 201, 'Service request created', service)
  } catch (error) {
    next(error)
  }
}

// @desc    Get my service requests (driver)
// @route   GET /api/services/my
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id })
      .populate('vehicle', 'name plate')
      .populate('mechanic', 'name phone')
      .sort({ createdAt: -1 })
    return successResponse(res, 200, 'Requests fetched', requests)
  } catch (error) {
    next(error)
  }
}

// @desc    Get single request
// @route   GET /api/services/:id
export const getRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('vehicle')
      .populate('user', 'name phone email')
      .populate('mechanic', 'name phone')
    if (!request) return errorResponse(res, 404, 'Request not found')
    return successResponse(res, 200, 'Request fetched', request)
  } catch (error) {
    next(error)
  }
}

// @desc    Update request status
// @route   PUT /api/services/:id/status
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'Completed' && { completedAt: new Date() }),
      },
      { new: true }
    )

    if (!request) return errorResponse(res, 404, 'Request not found')

    const statusMessages = {
      'En Route': '🚗 Your mechanic is on the way!',
      Arrived: '📍 Your mechanic has arrived at your location.',
      Completed: '✅ Service completed. Please rate your experience.',
      Cancelled: '❌ Your service request was cancelled.',
    }

    await createNotification({
      userId: request.user,
      title: `Service ${status}`,
      message:
        statusMessages[status] ||
        `Your ${request.serviceType} request is now ${status}.`,
      type: status === 'Completed' ? 'rating' : 'job',
      link: `/track/${request._id}`,
    })

    return successResponse(res, 200, 'Status updated', request)
  } catch (error) {
    next(error)
  }
}

// @desc    Submit feedback + update mechanic rating
// @route   POST /api/services/:id/feedback
export const submitFeedback = async (req, res, next) => {
  try {
    const { rating, review } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse(res, 400, 'Rating must be between 1 and 5')
    }

    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { rating, review: review || '' },
      { new: true }
    )

    if (!request) return errorResponse(res, 404, 'Request not found')

    if (request.mechanic) {
      const allRated = await ServiceRequest.find({
        mechanic: request.mechanic,
        rating: { $gt: 0 },
      }).select('rating')

      const avgRating =
        allRated.reduce((sum, r) => sum + r.rating, 0) / allRated.length

      const totalJobs = await ServiceRequest.countDocuments({
        mechanic: request.mechanic,
        status: 'Completed',
      })

      await Mechanic.findOneAndUpdate(
        { user: request.mechanic },
        {
          rating: Math.round(avgRating * 10) / 10,
          totalJobs,
        }
      )

      await createNotification({
        userId: request.mechanic,
        title: `⭐ New ${rating}-star rating`,
        message: review
          ? `"${review.substring(0, 60)}"`
          : 'You received a new rating',
        type: 'rating',
        link: '/mechanic',
      })
    }

    return successResponse(res, 200, 'Feedback submitted', request)
  } catch (error) {
    next(error)
  }
}

// @desc    Mechanic accepts a request
// @route   PUT /api/services/:id/accept
export const acceptRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
    if (!request) return errorResponse(res, 404, 'Request not found')

    if (request.status !== 'Requested') {
      return errorResponse(res, 400, `Cannot accept a ${request.status} request`)
    }

    request.mechanic = req.user._id
    request.status = 'Accepted'
    await request.save()

    const populated = await ServiceRequest.findById(request._id)
      .populate('user', 'name phone')
      .populate('vehicle', 'name plate')
      .populate('mechanic', 'name phone')

    await createNotification({
      userId: request.user,
      title: '🔧 Mechanic accepted your request',
      message: `${req.user.name} is on the way to help you`,
      type: 'job',
      link: `/track/${request._id}`,
    })

    return successResponse(res, 200, 'Request accepted', populated)
  } catch (error) {
    next(error)
  }
}

// @desc    Get mechanic's jobs
// @route   GET /api/services/mechanic/jobs
export const getMechanicJobs = async (req, res, next) => {
  try {
    const { tab } = req.query
    let filter = {}

    if (tab === 'new') {
      filter = {
        status: 'Requested',
        $or: [
          { mechanic: null },
          { mechanic: { $exists: false } },
          { mechanic: req.user._id },
        ],
      }
    } else if (tab === 'progress') {
      filter = {
        mechanic: req.user._id,
        status: { $in: ['Accepted', 'En Route', 'Arrived'] },
      }
    } else if (tab === 'completed') {
      filter = { mechanic: req.user._id, status: 'Completed' }
    } else {
      filter = {
        $or: [
          { status: 'Requested', mechanic: null },
          { status: 'Requested', mechanic: req.user._id },
          { mechanic: req.user._id },
        ],
      }
    }

    const jobs = await ServiceRequest.find(filter)
      .populate('user', 'name phone')
      .populate('vehicle', 'name plate type')
      .populate('mechanic', 'name phone')
      .sort({ createdAt: -1 })

    return successResponse(res, 200, 'Jobs fetched', jobs)
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel request (driver)
// @route   PUT /api/services/:id/cancel
export const cancelRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
    if (!request) return errorResponse(res, 404, 'Request not found')

    if (request.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }
    if (['Completed', 'Cancelled'].includes(request.status)) {
      return errorResponse(res, 400, `Cannot cancel a ${request.status} request`)
    }

    request.status = 'Cancelled'
    await request.save()

    if (request.mechanic) {
      await createNotification({
        userId: request.mechanic,
        title: '❌ Request cancelled',
        message: `A ${request.serviceType} request you accepted was cancelled.`,
        type: 'job',
        link: '/mechanic',
      })
    }

    return successResponse(res, 200, 'Request cancelled', request)
  } catch (error) {
    next(error)
  }
}
import Dispute from '../models/Dispute.js'
import ServiceRequest from '../models/ServiceRequest.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// ============================================
// USER-FACING ENDPOINTS
// ============================================

// @desc    Raise a new dispute (any logged-in user)
// @route   POST /api/disputes
export const createDispute = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      against,
      relatedService,
      relatedOrder,
      jobId,
      amount,
    } = req.body

    if (!title || !description) {
      return errorResponse(res, 400, 'Title and description are required')
    }

    if (!against) {
      return errorResponse(res, 400, 'Please specify who this dispute is against')
    }

    // Verify the "against" user exists
    const againstUser = await User.findById(against)
    if (!againstUser) {
      return errorResponse(res, 404, 'User not found')
    }

    // Prevent self-dispute
    if (against.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot raise a dispute against yourself')
    }

    const dispute = await Dispute.create({
      title,
      description,
      category: category || 'Other',
      priority: priority || 'Medium',
      raisedBy: req.user._id,
      against,
      relatedService: relatedService || null,
      relatedOrder: relatedOrder || null,
      jobId: jobId || '',
      amount: amount || 0,
      status: 'Open',
      messages: [
        {
          sender: req.user._id,
          senderName: req.user.name,
          senderRole: req.user.role,
          text: description,
        },
      ],
    })

    const populated = await Dispute.findById(dispute._id)
      .populate('raisedBy', 'name email role')
      .populate('against', 'name email role')

    return successResponse(res, 201, 'Dispute raised successfully', populated)
  } catch (error) {
    next(error)
  }
}

// @desc    Get my raised disputes
// @route   GET /api/disputes/my
export const getMyDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user._id })
      .populate('against', 'name email role')
      .sort({ createdAt: -1 })

    return successResponse(res, 200, 'Your disputes fetched', disputes)
  } catch (error) {
    next(error)
  }
}

// @desc    Get disputes against me
// @route   GET /api/disputes/against-me
export const getDisputesAgainstMe = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({ against: req.user._id })
      .populate('raisedBy', 'name email role')
      .sort({ createdAt: -1 })

    return successResponse(res, 200, 'Disputes against you fetched', disputes)
  } catch (error) {
    next(error)
  }
}

// @desc    Get single dispute (only if involved or admin)
// @route   GET /api/disputes/:id
export const getDisputeById = async (req, res, next) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('raisedBy', 'name email role phone city')
      .populate('against', 'name email role phone city')
      .populate('resolvedBy', 'name role')

    if (!dispute) return errorResponse(res, 404, 'Dispute not found')

    const isInvolved =
      dispute.raisedBy._id.toString() === req.user._id.toString() ||
      (dispute.against && dispute.against._id.toString() === req.user._id.toString())
    const isAdmin = req.user.role === 'admin'

    if (!isInvolved && !isAdmin) {
      return errorResponse(res, 403, 'Not authorized to view this dispute')
    }

    return successResponse(res, 200, 'Dispute fetched', dispute)
  } catch (error) {
    next(error)
  }
}

// @desc    Add a message to dispute
// @route   POST /api/disputes/:id/messages
export const addMessage = async (req, res, next) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) {
      return errorResponse(res, 400, 'Message text required')
    }

    const dispute = await Dispute.findById(req.params.id)
    if (!dispute) return errorResponse(res, 404, 'Dispute not found')

    const isInvolved =
      dispute.raisedBy.toString() === req.user._id.toString() ||
      (dispute.against && dispute.against.toString() === req.user._id.toString())
    const isAdmin = req.user.role === 'admin'

    if (!isInvolved && !isAdmin) {
      return errorResponse(res, 403, 'Not authorized')
    }

    dispute.messages.push({
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      text: text.trim(),
      isAdminNote: isAdmin,
    })

    await dispute.save()

    return successResponse(res, 200, 'Message sent', dispute)
  } catch (error) {
    next(error)
  }
}

// @desc    Get disputes for a specific service (helpful when customer clicks "Raise Dispute")
// @route   GET /api/disputes/service/:serviceId
export const getServiceDispute = async (req, res, next) => {
  try {
    const dispute = await Dispute.findOne({
      relatedService: req.params.serviceId,
      raisedBy: req.user._id,
    })

    return successResponse(res, 200, 'Dispute checked', dispute || null)
  } catch (error) {
    next(error)
  }
}

// ============================================
// ADMIN-FACING ENDPOINTS
// ============================================

// @desc    Get all disputes (admin)
// @route   GET /api/admin/disputes
export const getAllDisputes = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query

    const filter = {}
    if (status && status !== 'All') filter.status = status
    if (priority && priority !== 'All') filter.priority = priority

    let disputes = await Dispute.find(filter)
      .populate('raisedBy', 'name email role phone city')
      .populate('against', 'name email role phone city')
      .populate('resolvedBy', 'name role')
      .sort({ createdAt: -1 })

    // Simple text search
    if (search) {
      const q = search.toLowerCase()
      disputes = disputes.filter(
        (d) =>
          d.disputeId?.toLowerCase().includes(q) ||
          d.title?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q) ||
          d.raisedBy?.name?.toLowerCase().includes(q)
      )
    }

    return successResponse(res, 200, 'Disputes fetched', disputes)
  } catch (error) {
    next(error)
  }
}

// @desc    Get dispute stats (admin)
// @route   GET /api/admin/disputes/stats
export const getDisputeStats = async (req, res, next) => {
  try {
    const [open, inProgress, resolved, escalated] = await Promise.all([
      Dispute.countDocuments({ status: 'Open' }),
      Dispute.countDocuments({ status: 'In Progress' }),
      Dispute.countDocuments({ status: 'Resolved' }),
      Dispute.countDocuments({ status: 'Escalated' }),
    ])

    return successResponse(res, 200, 'Dispute stats fetched', {
      open,
      progress: inProgress,
      resolved,
      escalated,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update dispute status (admin)
// @route   PUT /api/admin/disputes/:id
export const updateDispute = async (req, res, next) => {
  try {
    const { status, priority, resolution, escalated } = req.body
    const updateData = {}

    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (resolution !== undefined) updateData.resolution = resolution
    if (escalated !== undefined) updateData.escalated = escalated

    // Auto-track resolution metadata
    if (status === 'Resolved') {
      updateData.resolvedBy = req.user._id
      updateData.resolvedAt = new Date()
    }

    const dispute = await Dispute.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('raisedBy', 'name email role')
      .populate('against', 'name email role')

    if (!dispute) return errorResponse(res, 404, 'Dispute not found')

    return successResponse(res, 200, 'Dispute updated', dispute)
  } catch (error) {
    next(error)
  }
}
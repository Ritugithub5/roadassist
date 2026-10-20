import User from '../models/User.js'
import Dispute from '../models/Dispute.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { createNotification } from './notificationController.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    return successResponse(res, 200, 'Users fetched', users)
  } catch (error) {
    next(error)
  }
}

// @desc    Suspend/Activate/Verify user
// @route   PUT /api/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['Active', 'Suspended', 'Pending Verification']

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, 'Invalid status value')
    }

    const updateData = { status }
    if (status === 'Active') updateData.verified = true

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!user) return errorResponse(res, 404, 'User not found')

    // 🔔 Notify the user about their status change
    const statusMessages = {
      Active: '🎉 Your account has been verified and activated!',
      Suspended: 'Your account has been suspended. Contact support.',
      'Pending Verification':
        'Your account is pending verification. We\'ll notify you soon.',
    }

    await createNotification({
      userId: user._id,
      title: `Account ${status}`,
      message: statusMessages[status] || `Your account status is now ${status}.`,
      type: 'system',
      link: user.role === 'mechanic' ? '/mechanic' : user.role === 'seller' ? '/seller' : '/dashboard',
    })

    return successResponse(res, 200, 'User status updated', user)
  } catch (error) {
    next(error)
  }
}

// @desc    Get all disputes
// @route   GET /api/admin/disputes
export const getAllDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find()
      .populate('raisedBy', 'name email role phone city')
      .populate('against', 'name email role phone city')
      .sort({ createdAt: -1 })
    return successResponse(res, 200, 'Disputes fetched', disputes)
  } catch (error) {
    next(error)
  }
}

// @desc    Update dispute status
// @route   PUT /api/admin/disputes/:id
export const updateDispute = async (req, res, next) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!dispute) return errorResponse(res, 404, 'Dispute not found')

    // 🔔 Notify the dispute raiser
    if (req.body.status) {
      await createNotification({
        userId: dispute.raisedBy,
        title: `Dispute ${req.body.status}`,
        message: `Your dispute has been marked as ${req.body.status}.`,
        type: 'dispute',
        link: '/dashboard',
      })
    }

    return successResponse(res, 200, 'Dispute updated', dispute)
  } catch (error) {
    next(error)
  }
}

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, openDisputes] = await Promise.all([
      User.countDocuments(),
      ServiceRequest.countDocuments({ status: 'Completed' }),
      Dispute.countDocuments({ status: { $ne: 'Resolved' } }),
    ])

    const revenueAgg = await ServiceRequest.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalRevenue = revenueAgg[0]?.total || 0

    return successResponse(res, 200, 'Stats fetched', {
      totalUsers,
      totalJobs,
      openDisputes,
      totalRevenue,
    })
  } catch (error) {
    next(error)
  }
}
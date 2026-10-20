import Notification from '../models/Notification.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get my notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    })

    return successResponse(res, 200, 'Notifications fetched', {
      notifications,
      unreadCount,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark one as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const n = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    if (!n) return errorResponse(res, 404, 'Notification not found')
    return successResponse(res, 200, 'Marked as read', n)
  } catch (error) {
    next(error)
  }
}

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    )
    return successResponse(res, 200, 'All marked as read')
  } catch (error) {
    next(error)
  }
}

// @desc    Delete one notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const n = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!n) return errorResponse(res, 404, 'Notification not found')
    return successResponse(res, 200, 'Deleted')
  } catch (error) {
    next(error)
  }
}

// ============ HELPER — Fire-and-forget notification creator ============
export const createNotification = async ({
  userId,
  title,
  message,
  type = 'system',
  link = '',
}) => {
  try {
    if (!userId || !title) return null
    return await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
    })
  } catch (error) {
    console.error('❌ Notification create failed:', error.message)
    return null
  }
}
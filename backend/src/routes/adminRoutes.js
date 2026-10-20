import express from 'express'
import {
  getAllUsers,
  updateUserStatus,
  getAllDisputes,
  updateDispute as adminUpdateDispute,
  getStats,
} from '../controllers/adminController.js'
import { getDisputeStats } from '../controllers/disputeController.js'
import {
  getReports,
  getDashboardStats,
  getPendingVerifications,
  getLiveRequests,
} from '../controllers/adminReportController.js'
import ServiceRequest from '../models/ServiceRequest.js'
import Order from '../models/Order.js'
import { protect, authorize } from '../middleware/authMiddleware.js'
import { successResponse } from '../utils/apiResponse.js'

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

// Dashboard
router.get('/stats', getStats)
router.get('/dashboard-stats', getDashboardStats)
router.get('/pending-verifications', getPendingVerifications)
router.get('/live-requests', getLiveRequests)

// Reports
router.get('/reports', getReports)

// Users
router.get('/users', getAllUsers)
router.put('/users/:id/status', updateUserStatus)

// Disputes
router.get('/disputes', getAllDisputes)
router.get('/disputes/stats', getDisputeStats)
router.put('/disputes/:id', adminUpdateDispute)

// Services
router.get('/services', async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const services = await ServiceRequest.find(filter)
      .populate('user', 'name phone')
      .populate('mechanic', 'name phone')
      .populate('vehicle', 'name plate')
      .sort({ createdAt: -1 })
      .limit(100)

    return successResponse(res, 200, 'Services fetched', services)
  } catch (error) {
    next(error)
  }
})

// Orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100)

    return successResponse(res, 200, 'Orders fetched', orders)
  } catch (error) {
    next(error)
  }
})

export default router
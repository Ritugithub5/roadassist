import express from 'express'
import {
  createRequest,
  getMyRequests,
  getRequest,
  updateStatus,
  submitFeedback,
  acceptRequest,
  getMechanicJobs,
  cancelRequest,
} from '../controllers/serviceController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

// Specific routes FIRST
router.get('/my', authorize('driver'), getMyRequests)
router.get('/mechanic/jobs', authorize('mechanic'), getMechanicJobs)

// General
router.post('/', authorize('driver'), createRequest)
router.get('/:id', getRequest) // permission checked in controller
router.put('/:id/cancel', authorize('driver'), cancelRequest)
router.post('/:id/feedback', authorize('driver'), submitFeedback)
router.put('/:id/accept', authorize('mechanic'), acceptRequest)
router.put('/:id/status', authorize('mechanic', 'admin'), updateStatus)

export default router
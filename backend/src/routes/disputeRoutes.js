import express from 'express'
import {
  createDispute,
  getMyDisputes,
  getDisputesAgainstMe,
  getDisputeById,
  addMessage,
  getServiceDispute,
} from '../controllers/disputeController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', createDispute)
router.get('/my', getMyDisputes)
router.get('/against-me', getDisputesAgainstMe)
router.get('/service/:serviceId', getServiceDispute)
router.get('/:id', getDisputeById)
router.post('/:id/messages', addMessage)

export default router
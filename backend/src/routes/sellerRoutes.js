import express from 'express'
import {
  getSellerProfile,
  updateSellerProfile,
} from '../controllers/sellerController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorize('seller'))

router.get('/me', getSellerProfile)
router.put('/me', updateSellerProfile)

export default router
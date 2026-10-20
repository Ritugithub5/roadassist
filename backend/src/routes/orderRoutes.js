import express from 'express'
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  getSellerEarnings,
} from '../controllers/orderController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

// ✅ Any logged-in user can place an order and view their own
router.post('/', createOrder)
router.get('/my', getMyOrders)

// Seller-only routes
router.get('/seller', authorize('seller'), getSellerOrders)
router.get('/seller/earnings', authorize('seller'), getSellerEarnings)
router.put('/:id/status', authorize('seller'), updateOrderStatus)

// Any authenticated — must be LAST (dynamic :id)
router.get('/:id', getOrder)

export default router
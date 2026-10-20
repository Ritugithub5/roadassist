import express from 'express'
import {
  getProducts,
  getProduct,
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.get('/', getProducts)

// Seller only
router.use(protect)
router.get('/seller/me', authorize('seller'), getMyProducts)
router.post('/', authorize('seller'), addProduct)
router.put('/:id', authorize('seller'), updateProduct)
router.delete('/:id', authorize('seller'), deleteProduct)

// Public (dynamic) — LAST
router.get('/:id', getProduct)

export default router
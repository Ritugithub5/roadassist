import express from 'express'
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getBrands)

router.use(protect)
router.use(authorize('admin'))
router.post('/', createBrand)
router.put('/:id', updateBrand)
router.delete('/:id', deleteBrand)

export default router
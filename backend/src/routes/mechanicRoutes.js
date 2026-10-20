import express from 'express'
import {
  getMechanics,
  getMyProfile,
  upsertProfile,
  toggleOnline,
  getNearbyMechanics,
  getMechanicById,
  updateServices,
  updateAvailability,
  getEarnings,
} from '../controllers/mechanicController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.get('/', getMechanics)
router.get('/nearby', getNearbyMechanics)

// Mechanic only (specific routes BEFORE /:id)
router.use(protect)
router.get('/me', authorize('mechanic'), getMyProfile)
router.put('/me', authorize('mechanic'), upsertProfile)
router.put('/me/online', authorize('mechanic'), toggleOnline)
router.put('/me/services', authorize('mechanic'), updateServices)
router.put('/me/availability', authorize('mechanic'), updateAvailability)
router.get('/me/earnings', authorize('mechanic'), getEarnings)

// Dynamic ID — LAST
router.get('/:id', getMechanicById)

export default router
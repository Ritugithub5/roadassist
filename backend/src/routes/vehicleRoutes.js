import express from 'express'
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
  getVehicleStats,
} from '../controllers/vehicleController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

// ⚠️ IMPORTANT: /stats MUST come BEFORE /:id
// Otherwise Express treats "stats" as a vehicle ID
router.get('/stats', getVehicleStats)

// General CRUD
router.route('/').get(getVehicles).post(addVehicle)
router.route('/:id').put(updateVehicle).delete(deleteVehicle)
router.put('/:id/default', setDefaultVehicle)

export default router
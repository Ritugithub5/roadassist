import express from 'express'
import { body } from 'express-validator'
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validateMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/me', getProfile)
router.put('/me', updateProfile)

router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be 6+ chars'),
  ],
  validate,
  changePassword
)

export default router
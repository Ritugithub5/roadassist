import express from 'express'
import { submitContact } from '../controllers/contactController.js'

const router = express.Router()

// Public route
router.post('/', submitContact)

export default router
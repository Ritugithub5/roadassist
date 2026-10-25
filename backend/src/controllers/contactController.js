import Contact from '../models/Contact.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Submit a contact form
// @route   POST /api/contact
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !phone || !subject || !message) {
      return errorResponse(res, 400, 'All fields are required')
    }

    const contact = await Contact.create({
      name, email, phone, subject, message,
    })

    return successResponse(res, 201, 'Message sent successfully!', contact)
  } catch (error) {
    next(error)
  }
}
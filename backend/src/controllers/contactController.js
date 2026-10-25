import Contact from '../models/Contact.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, address } = req.body // ✅ Added address

    if (!name || !email || !phone || !subject || !message || !address) {
      return errorResponse(res, 400, 'All fields are required')
    }

    // Server-side validation
    if (phone.length !== 10 || isNaN(phone)) {
      return errorResponse(res, 400, 'Phone number must be exactly 10 digits')
    }

    const contact = await Contact.create({
      name, email, phone, subject, message, address,
    })

    return successResponse(res, 201, 'Message sent successfully!', contact)
  } catch (error) {
    next(error)
  }
}
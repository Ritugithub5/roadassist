import Vehicle from '../models/Vehicle.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get user's vehicles
// @route   GET /api/vehicles
export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id }).sort({ createdAt: -1 })
    return successResponse(res, 200, 'Vehicles fetched', vehicles)
  } catch (error) {
    next(error)
  }
}

// @desc    Add vehicle
// @route   POST /api/vehicles
export const addVehicle = async (req, res, next) => {
  try {
    // First vehicle automatically becomes default
    const count = await Vehicle.countDocuments({ user: req.user._id })
    const vehicle = await Vehicle.create({
      ...req.body,
      user: req.user._id,
      isDefault: count === 0,
    })
    return successResponse(res, 201, 'Vehicle added', vehicle)
  } catch (error) {
    next(error)
  }
}

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
export const updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found')
    if (vehicle.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    return successResponse(res, 200, 'Vehicle updated', vehicle)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) return errorResponse(res, 404, 'Vehicle not found')
    if (vehicle.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }

    await vehicle.deleteOne()

    // If we deleted the default, make another one default
    if (vehicle.isDefault) {
      const nextDefault = await Vehicle.findOne({ user: req.user._id })
      if (nextDefault) {
        nextDefault.isDefault = true
        await nextDefault.save()
      }
    }

    return successResponse(res, 200, 'Vehicle deleted')
  } catch (error) {
    next(error)
  }
}

// @desc    Set default vehicle
// @route   PUT /api/vehicles/:id/default
export const setDefaultVehicle = async (req, res, next) => {
  try {
    const target = await Vehicle.findById(req.params.id)
    if (!target) return errorResponse(res, 404, 'Vehicle not found')
    if (target.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized')
    }

    await Vehicle.updateMany({ user: req.user._id }, { isDefault: false })
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      { new: true }
    )
    return successResponse(res, 200, 'Default vehicle set', vehicle)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's vehicle & service stats
// @route   GET /api/vehicles/stats
export const getVehicleStats = async (req, res, next) => {
  try {
    const [totalVehicles, completedServices] = await Promise.all([
      Vehicle.countDocuments({ user: req.user._id }),
      ServiceRequest.find({
        user: req.user._id,
        status: 'Completed',
      }).select('total'),
    ])

    const totalServices = completedServices.length
    const totalSpent = completedServices.reduce((sum, s) => sum + (s.total || 0), 0)
    // Assume 20% savings on each service (in real app, from actual discounts)
    const totalSavings = Math.round(totalSpent * 0.2)

    return successResponse(res, 200, 'Stats fetched', {
      totalVehicles,
      totalServices,
      totalSpent,
      totalSavings,
    })
  } catch (error) {
    next(error)
  }
}
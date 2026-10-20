import mongoose from 'mongoose'

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, default: '' },
    year: { type: Number, required: true },
    plate: { type: String, required: true },
    type: {
      type: String,
      enum: ['car', 'bike', 'suv', 'truck'],
      default: 'car',
    },
    fuel: {
      type: String,
      enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid'],
      default: 'petrol',
    },
    color: { type: String, default: '' },
    odometer: { type: Number, default: 0 },
    healthScore: { type: Number, default: 100 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Vehicle', vehicleSchema)
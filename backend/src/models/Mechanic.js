import mongoose from 'mongoose'

const mechanicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    garageName: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    address: { type: String, required: true },
    about: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    services: [
      {
        id: String,
        enabled: { type: Boolean, default: true },
        price: Number,
        eta: Number,
      },
    ],
    availability: {
      monday: { open: Boolean, from: String, to: String },
      tuesday: { open: Boolean, from: String, to: String },
      wednesday: { open: Boolean, from: String, to: String },
      thursday: { open: Boolean, from: String, to: String },
      friday: { open: Boolean, from: String, to: String },
      saturday: { open: Boolean, from: String, to: String },
      sunday: { open: Boolean, from: String, to: String },
    },
  },
  { timestamps: true }
) 

export default mongoose.model('Mechanic', mechanicSchema)
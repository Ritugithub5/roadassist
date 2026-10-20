import mongoose from 'mongoose'

const serviceRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceType: {
      type: String,
      enum: ['breakdown', 'towing', 'battery', 'tire', 'fuel', 'inspection'],
      required: true,
    },
    location: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'En Route', 'Arrived', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    amount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ['UPI', 'Cash', 'Card', 'Pending'],
      default: 'Pending',
    },
    rating: { type: Number, default: 0 },
    review: { type: String, default: '' },
    completedAt: { type: Date },
  },
  { timestamps: true }
)

serviceRequestSchema.pre('save', function () {
  if (!this.requestId) {
    this.requestId = 'SR-' + Math.floor(1000 + Math.random() * 9000)
  }
})

export default mongoose.model('ServiceRequest', serviceRequestSchema)
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String },
    senderRole: { type: String },
    text: { type: String, required: true },
    isAdminNote: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const disputeSchema = new mongoose.Schema(
  {
    disputeId: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Late Arrival',
        'Overcharging',
        'Poor Service',
        'Behaviour',
        'Wrong Item',
        'Payment Issue',
        'Property Damage',
        'Billing',
        'Other',
      ],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Escalated'],
      default: 'Open',
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    jobId: { type: String },
    amount: { type: Number, default: 0 },
    escalated: { type: Boolean, default: false },
    resolution: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    messages: [messageSchema],
  },
  { timestamps: true }
)

// Auto-generate disputeId
disputeSchema.pre('save', function () {
  if (!this.disputeId) {
    this.disputeId = 'DSP-' + Math.floor(1000 + Math.random() * 9000)
  }
})

export default mongoose.model('Dispute', disputeSchema)
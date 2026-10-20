import mongoose from 'mongoose'

const insuranceQuoteSchema = new mongoose.Schema(
  {
    quoteId: { type: String, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Optional: quote can be requested by guest
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    regNumber: { type: String, uppercase: true, default: '' },
    plan: {
      type: String,
      enum: ['any', 'third-party', 'comprehensive', 'premium'],
      default: 'any',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Lost'],
      default: 'New',
    },
  },
  { timestamps: true }
)

// Auto-generate quoteId like INS-123456
insuranceQuoteSchema.pre('save', function () {
  if (!this.quoteId) {
    this.quoteId = 'INS-' + Math.floor(100000 + Math.random() * 900000)
  }
})

export default mongoose.model('InsuranceQuote', insuranceQuoteSchema)
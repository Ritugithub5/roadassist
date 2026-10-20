import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['tools', 'emergency', 'care', 'tech'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
image: { type: String, default: '' }, 
    emoji: { type: String, default: '📦' }, // For visual placeholder
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    badge: { type: String, default: '' }, // "Bestseller", "New", etc.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Index for search
productSchema.index({ name: 'text', description: 'text' })

export default mongoose.model('Product', productSchema)
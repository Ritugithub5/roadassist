import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },       // "Tools"
    slug: { type: String, required: true, unique: true },       // "tools"
    icon: { type: String, default: '📦' },                      // emoji
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },                        // display order
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Category', categorySchema)
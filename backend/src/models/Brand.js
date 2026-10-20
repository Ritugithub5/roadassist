import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },       // "Maruti Suzuki"
    slug: { type: String, required: true, unique: true },       // "maruti-suzuki"
    logo: { type: String, default: '' },                        // optional logo URL
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Brand', brandSchema)
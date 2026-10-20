import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, 'Phone is required'] },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['driver', 'mechanic', 'seller', 'admin'],
      default: 'driver',
    },
    city: { type: String, default: '' },
    avatar: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Pending Verification'],
      default: 'Active',
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// ✅ Mongoose 9+ — async without next
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)
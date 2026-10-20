import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import User from '../src/models/User.js'

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('📡 Connected to MongoDB')

    const existing = await User.findOne({ email: 'admin@roadassist.in' })
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email)
      process.exit(0)
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@roadassist.in',
      phone: '9000000000',
      password: 'admin123',
      role: 'admin',
      city: 'Bangalore',
      status: 'Active',
      verified: true,
    })

    console.log('')
    console.log('✅ Admin created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:    admin@roadassist.in')
    console.log('🔑 Password: admin123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

createAdmin()
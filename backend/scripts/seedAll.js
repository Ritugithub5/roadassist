import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import Product from '../src/models/Product.js'
import Category from '../src/models/Category.js'
import Brand from '../src/models/Brand.js'
import User from '../src/models/User.js'

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('📡 Connected to MongoDB')

    // ============ CATEGORIES ============
    await Category.deleteMany({})
    const categories = await Category.insertMany([
      { name: 'All', slug: 'all', icon: '🛒', order: 0 },
      { name: 'Tools', slug: 'tools', icon: '🔧', order: 1 },
      { name: 'Emergency', slug: 'emergency', icon: '🚨', order: 2 },
      { name: 'Car Care', slug: 'care', icon: '✨', order: 3 },
      { name: 'Tech', slug: 'tech', icon: '📱', order: 4 },
    ])
    console.log(`✅ ${categories.length} categories seeded`)

    // ============ BRANDS ============
    await Brand.deleteMany({})
    const brands = await Brand.insertMany([
      { name: 'Maruti Suzuki', slug: 'maruti-suzuki', order: 1 },
      { name: 'Hyundai', slug: 'hyundai', order: 2 },
      { name: 'Tata', slug: 'tata', order: 3 },
      { name: 'Mahindra', slug: 'mahindra', order: 4 },
      { name: 'Kia', slug: 'kia', order: 5 },
      { name: 'Toyota', slug: 'toyota', order: 6 },
      { name: 'Honda', slug: 'honda', order: 7 },
      { name: 'Volkswagen', slug: 'volkswagen', order: 8 },
      { name: 'BMW', slug: 'bmw', order: 9 },
      { name: 'Audi', slug: 'audi', order: 10 },
    ])
    console.log(`✅ ${brands.length} brands seeded`)

    // ============ PRODUCTS ============
    const seller = await User.findOne({ role: 'seller' })
    if (!seller) {
      console.log('⚠️  No seller found. Skipping products.')
      console.log('   Register a seller first, then re-run.')
      process.exit(0)
    }

    await Product.deleteMany({ seller: seller._id })

    // ✅ Images served from frontend/src/image/ folder
    const products = [
      {
        seller: seller._id,
        name: 'Professional Tool Kit — 108 Pcs',
        description: 'Chrome vanadium steel socket and wrench set.',
        category: 'tools',
        price: 2299,
        mrp: 3299,
        stock: 15,
        image: '/image/car_tool.png',
        emoji: '🧰',
        badge: 'Pro Pick',
        rating: 4.6,
        reviews: 189,
        sold: 15,
      },
      {
        seller: seller._id,
        name: 'Tyre Pressure Gauge — Digital',
        description: 'Backlit LCD. Accurate to ±0.5 PSI.',
        category: 'tools',
        price: 449,
        mrp: 699,
        stock: 30,
        image: '/image/car_air.png',
        emoji: '📏',
        badge: null,
        rating: 4.3,
        reviews: 302,
        sold: 24,
      },
      {
        seller: seller._id,
        name: 'RoadAssist Emergency Kit',
        description: 'Complete tool pouch with wrench, pliers, and safety gear.',
        category: 'emergency',
        price: 1899,
        mrp: 2499,
        stock: 18,
        image: '/image/car_emr.png',
        emoji: '🚨',
        badge: 'Bestseller',
        rating: 4.8,
        reviews: 342,
        sold: 42,
      },
      {
        seller: seller._id,
        name: 'Portable Jump Starter 12000mAh',
        description: 'Heavy-duty clamps. Starts any car in seconds.',
        category: 'emergency',
        price: 3499,
        mrp: 4999,
        stock: 8,
        image: '/image/car_jump.png',
        emoji: '🔋',
        badge: 'Top Rated',
        rating: 4.7,
        reviews: 218,
        sold: 34,
      },
      {
        seller: seller._id,
        name: 'Microfiber Wash Mitt + Towel Set',
        description: 'Scratch-free cleaning. 1200 GSM premium microfiber.',
        category: 'care',
        price: 599,
        mrp: 899,
        stock: 45,
        image: '/image/car_wash.png',
        emoji: '🧽',
        badge: 'Bestseller',
        rating: 4.7,
        reviews: 512,
        sold: 56,
      },
    ]

    await Product.insertMany(products)
    console.log(`✅ ${products.length} products seeded`)
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ All data seeded successfully!')
    console.log('📁 Images served from: frontend/src/image/')
    console.log('🔗 Image URL: http://localhost:5000/image/car_tool.png')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedAll()
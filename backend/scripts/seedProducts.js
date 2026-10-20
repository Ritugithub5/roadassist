import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import Product from '../src/models/Product.js'
import User from '../src/models/User.js'

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const seller = await User.findOne({ role: 'seller' })
    if (!seller) {
      console.log('❌ No seller found. Register a seller first.')
      process.exit(1)
    }

    // Clear old products by this seller
    await Product.deleteMany({ seller: seller._id })

    const products = [
      {
        seller: seller._id,
        name: 'RoadAssist Emergency Kit',
        description: 'Jumper cables, flashlight, first-aid, warning triangle and more.',
        category: 'emergency',
        price: 1899,
        mrp: 2499,
        stock: 18,
        emoji: '🚨',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80',
        badge: 'Bestseller',
        rating: 4.8,
        reviews: 342,
        sold: 42,
      },
      {
        seller: seller._id,
        name: 'Portable Jump Starter 12000mAh',
        description: 'Starts any car in seconds. Built-in USB charger and LED torch.',
        category: 'emergency',
        price: 3499,
        mrp: 4999,
        stock: 8,
        emoji: '🔋',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80',
        badge: 'Top Rated',
        rating: 4.7,
        reviews: 218,
        sold: 34,
      },
      {
        seller: seller._id,
        name: 'Digital Tyre Inflator',
        description: 'Preset pressure, auto shutoff, 12V DC.',
        category: 'tools',
        price: 1399,
        mrp: 1999,
        stock: 24,
        emoji: '💨',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        rating: 4.5,
        reviews: 641,
        sold: 28,
      },
      {
        seller: seller._id,
        name: 'Professional Tool Kit 108 Pcs',
        description: 'Chrome vanadium steel wrenches, sockets, screwdrivers.',
        category: 'tools',
        price: 2299,
        mrp: 3299,
        stock: 12,
        emoji: '🧰',
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
        badge: 'Pro Pick',
        rating: 4.6,
        reviews: 189,
        sold: 15,
      },
      {
        seller: seller._id,
        name: 'Magnetic Dashboard Phone Mount',
        description: '360° rotation, one-hand use, strong N52 magnets.',
        category: 'tech',
        price: 699,
        mrp: 999,
        stock: 42,
        emoji: '📱',
        image: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=600&q=80',
        rating: 4.4,
        reviews: 518,
        sold: 25,
      },
    ]

    await Product.insertMany(products)
    console.log(`✅ ${products.length} products seeded for seller: ${seller.name}`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedProducts()
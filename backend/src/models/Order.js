import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  qty: { type: Number, required: true, min: 1 },
  emoji: String,
})

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddress: {
      name: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMode: {
      type: String,
      enum: ['COD', 'UPI', 'Card', 'Pending'],
      default: 'Pending',
    },
    deliveredAt: Date,
  },
  { timestamps: true }
)

orderSchema.pre('save', function () {
  if (!this.orderId) {
    this.orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000)
  }
})

export default mongoose.model('Order', orderSchema)
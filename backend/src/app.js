import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

// Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import mechanicRoutes from './routes/mechanicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import disputeRoutes from './routes/disputeRoutes.js'
import sellerRoutes from './routes/sellerRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
)

// Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use(
//   '/uploads',
//   express.static(path.join(__dirname, '../../frontend/src/image'))
// )

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RoadAssist API is running',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/mechanics', mechanicRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/disputes', disputeRoutes)
app.use('/api/sellers', sellerRoutes)
app.use('/api/contact', contactRoutes)

// Error handlers
// app.use(notFound)
app.use(errorHandler)

export default app 
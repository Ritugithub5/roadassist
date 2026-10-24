import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './src/app.js'
import connectDB from './src/config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  // ✅ Serve from the dist folder right inside the backend
  const frontendPath = path.join(__dirname, 'dist')

  app.use(express.static(frontendPath))

  // ✅ Express v5 Safe Catch-All
  app.get(/.*/, (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' })
    }
    res.sendFile(path.resolve(frontendPath, 'index.html'))
  })

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
})
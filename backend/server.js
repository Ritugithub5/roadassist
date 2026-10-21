import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './src/app.js'
import connectDB from './src/config/db.js'

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

// Connect DB then start server
connectDB().then(() => {
  // ✅ SERVE FRONTEND IN PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    // Point to the 'dist' folder inside the frontend directory
    const frontendPath = path.join(__dirname, '../frontend/dist')

    // Serve static files (JS, CSS, images, etc.)
    app.use(express.static(frontendPath))

    // ✅ Catch-all route using RegExp (Fixes Express v5 crash)
    // Any route that is NOT an API route gets sent the React index.html
    app.get(/.*/, (req, res) => {
      if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.resolve(frontendPath, 'index.html'))
      } else {
        // If an API route isn't found, pass it to the 404 handler
        res.status(404).json({ message: 'API route not found' })
      }
    })
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`)
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`🌍 Frontend is being served from: ${path.join(__dirname, '../frontend/dist')}`)
    }
  })
})
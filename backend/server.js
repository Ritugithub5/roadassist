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
  // If we are on Render (NODE_ENV=production), serve the built React files
  if (process.env.NODE_ENV === 'production') {
    // Point to the 'dist' folder inside the frontend directory
    const frontendPath = path.join(__dirname, '../frontend/dist')

    // Serve static files (JS, CSS, images)
    app.use(express.static(frontendPath))

    // Catch-all route: If a user visits any URL that is NOT an API route,
    // send them the React index.html file (this makes React Router work)
    app.get('*', (req, res) => {
      // Don't intercept API routes
      if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.resolve(frontendPath, 'index.html'))
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
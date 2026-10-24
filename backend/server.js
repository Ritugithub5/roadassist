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
  if (process.env.NODE_ENV === 'production') {
    // ✅ Go up one folder from 'backend' to find 'frontend'
    const frontendPath = path.join(__dirname, '../frontend/dist')

    // Serve static files (JS, CSS, images)
    app.use(express.static(frontendPath))

    // ✅ Catch-all for React Router (Express v5 safe)
    app.get(/.*/, (req, res) => {
      // If it's an API route, let it pass to the API handler
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API route not found' })
      }
      
      // Otherwise, send the React index.html
      res.sendFile(path.resolve(frontendPath, 'index.html'))
    })
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🌍 Serving frontend from: ${path.join(__dirname, '../frontend/dist')}`)
  })
})
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
    // Point to the built React app
    const frontendPath = path.join(__dirname, '../frontend/dist')

    // Serve static files
    app.use(express.static(frontendPath))

    // Catch-all route (RegExp for Express 5)
    app.get(/.*/, (req, res) => {
      if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.resolve(frontendPath, 'index.html'))
      } else {
        res.status(404).json({ message: 'API route not found' })
      }
    })
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
})
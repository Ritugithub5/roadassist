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
  // ✅ Serve the built frontend files
  // We tell Express to look in the 'dist' folder in the root of the project
  const frontendPath = path.join(__dirname, '../frontend/dist')
  
  app.use(express.static(frontendPath))

  // ✅ Catch all routes and send React
  app.get(/.*/, (req, res) => {
    // If the route is an API route, let it fall through to the API
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' })
    }
    // Send the React app
    res.sendFile(path.resolve(frontendPath, 'index.html'))
  })

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
})
// server.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url'

// Database Configuration
import { connectDB } from "./config/db.js"

// Route Imports
import authRouter from "./routes/auth.js"
import postsRouter from "./routes/posts.js"
import productsRouter from "./routes/products.js"
import wardrobeRouter from "./routes/wardrobe.js"
import aiRouter from "./routes/ai.js"

// Middleware Imports
import { handleMulterError } from "./middleware/upload.js"
import { prewarmGradio } from "./services/aiService.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

// Prevent third-party API client network errors from crashing the backend process
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception thrown:', err)
})

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health/Status check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "StyleSnap+ Backend is running!",
    tokenConfigured: !!(process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN_1)
  })
})

// Register Routes
app.use("/api/auth", authRouter)
app.use("/api", postsRouter)
app.use("/api", productsRouter)
app.use("/api", wardrobeRouter)
app.use("/api", aiRouter)

// Serve frontend assets in production (registered after API routes)
if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'))) {
  console.log("📦 Serving compiled React static frontend from dist/")
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })
}

// Multer error handling middleware (registered after routers to catch file size/limits issues)
app.use(handleMulterError)

// Fallback general error handler
app.use((err, req, res, next) => {
  console.error("General Unhandled Server Error:", err)
  res.status(500).json({ error: err.message || "An unexpected error occurred." })
})

// Initialize DB and Start Server
connectDB().then(() => {
  app.listen(port, async () => {
    console.log(`🚀 StyleSnap+ Backend listening at http://localhost:${port}`)
    await prewarmGradio()
  })
})

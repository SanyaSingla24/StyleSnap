import express from "express"
import Wardrobe from "../models/Wardrobe.js"
import { isDbConnected } from "../config/db.js"

const router = express.Router()

// DB Endpoint: POST /api/wardrobe (Save item)
router.post("/wardrobe", async (req, res) => {
  try {
    const { userId, imageUrl, type } = req.body
    if (!userId || !imageUrl) return res.status(400).json({ error: "userId and imageUrl required" })
    const item = await Wardrobe.create({ userId, imageUrl, type })
    res.json(item)
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// DB Endpoint: GET /api/wardrobe/:userId (Fetch items)
router.get("/wardrobe/:userId", async (req, res) => {
  if (!isDbConnected()) return res.json([])
  try {
    const items = await Wardrobe.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// DB Endpoint: DELETE /api/wardrobe/:id (Delete item)
router.delete("/wardrobe/:id", async (req, res) => {
  try {
    await Wardrobe.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

export default router

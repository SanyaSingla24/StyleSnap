import express from "express"
import { upload } from "../middleware/upload.js"
import { executeTryOn, executeOutfitAnalysis, executeStyleChat } from "../services/aiService.js"

const router = express.Router()

// POST /api/tryon
router.post("/tryon", upload.fields([{ name: "user", maxCount: 1 }, { name: "outfit", maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.user) {
      return res.status(400).json({ error: "User photo is required." })
    }

    const userFile = req.files.user[0]
    const category = req.body.category || "upper_body"
    const description = req.body.description || "outfit"
    const outfitFile = req.files.outfit ? req.files.outfit[0] : null
    const outfitUrl = req.body.outfitUrl
    const origin = req.headers.origin || req.headers.referer || "http://localhost:5173"

    const result = await executeTryOn({ userFile, category, description, outfitFile, outfitUrl, origin })
    res.json(result)
  } catch (error) {
    console.error("Error in AI Try-On handler:", error)
    if (error.statusCode === 402) {
      return res.status(402).json({ error: error.message })
    }
    res.status(500).json({ error: error.message || "AI Try-On failed." })
  }
})

// POST /api/analyze
router.post("/analyze", upload.single("outfit"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Outfit image file is required." })
    }
    const outfitFile = req.file
    const feedback = await executeOutfitAnalysis({ outfitFile })
    res.json(feedback)
  } catch (error) {
    console.error("Error in AI Outfit Analysis handler:", error)
    res.status(500).json({ error: error.message || "AI Outfit Analysis failed." })
  }
})

// POST /api/style-chat
router.post("/style-chat", async (req, res) => {
  try {
    const { messages, context, styleDNA } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." })
    }
    const result = await executeStyleChat({ messages, context, styleDNA })
    res.json(result)
  } catch (err) {
    console.error("Error in style-chat:", err)
    res.status(500).json({ error: err.message || "Failed to generate chat response." })
  }
})

export default router

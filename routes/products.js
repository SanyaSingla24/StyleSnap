import express from "express"
import Product from "../models/Product.js"
import { authenticateToken } from "../middleware/auth.js"
import { isDbConnected } from "../config/db.js"

const router = express.Router()

// E-commerce Endpoint: POST /api/products (Designer uploads a product)
router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.json(product)
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// E-commerce Endpoint: DELETE /api/products/:id (Designer deletes their product)
router.delete("/products/:id", authenticateToken, async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: "Database disconnected" })
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: "Product not found" })

    // Verify ownership
    if (product.designerId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized to delete this product" })
    }

    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// E-commerce Endpoint: GET /api/products (Fetch all products for Shop)
router.get("/products", async (req, res) => {
  if (!isDbConnected()) return res.json([])
  try {
    const products = await Product.find().populate('designerId', 'username').sort({ createdAt: -1 })
    res.json(products)
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

export default router

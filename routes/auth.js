import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { isDbConnected } from "../config/db.js"

const router = express.Router()

// POST /api/auth/signup (Real Signup)
router.post("/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body
    if (!username || !password) return res.status(400).json({ error: "Username and password required" })
    
    if (!isDbConnected()) return res.status(503).json({ error: "Database not connected. Try again later." })

    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ error: "Username already exists." })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({ username, passwordHash, role: role || 'shopper' })
    const token = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_key_stylesnap', { expiresIn: '7d' })
    
    res.json({ _id: user._id, username: user.username, role: user.role, token })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// POST /api/auth/login (Real Login)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: "Username and password required" })
    
    if (!isDbConnected()) return res.status(503).json({ error: "Database not connected. Try again later." })

    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ error: "Invalid username or password." })

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) return res.status(400).json({ error: "Invalid username or password." })

    const token = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_key_stylesnap', { expiresIn: '7d' })
    
    res.json({ _id: user._id, username: user.username, role: user.role, token })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

export default router

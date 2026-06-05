import express from "express"
import Post from "../models/Post.js"
import { authenticateToken } from "../middleware/auth.js"
import { uploadDisk } from "../middleware/upload.js"
import { isDbConnected } from "../config/db.js"

const router = express.Router()

// General Endpoint: POST /api/upload (Upload image for Feed/Shop)
router.post("/upload", uploadDisk.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" })
  const port = process.env.PORT || 5000
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`
  res.json({ imageUrl })
})

// Social Endpoint: POST /api/posts (Influencer uploads a post)
router.post("/posts", async (req, res) => {
  try {
    const post = await Post.create(req.body)
    res.json(post)
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// Social Endpoint: DELETE /api/posts/:id (Influencer deletes their post)
router.delete("/posts/:id", authenticateToken, async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: "Database disconnected" })
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    // Verify ownership
    if (post.influencerId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized to delete this post" })
    }

    await Post.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// Social Endpoint: POST /api/posts/:id/like (Toggle Like)
router.post("/posts/:id/like", authenticateToken, async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: "Database disconnected" })
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const index = post.likes.indexOf(req.user._id)
    if (index === -1) {
      post.likes.push(req.user._id)
    } else {
      post.likes.splice(index, 1)
    }
    
    await post.save()
    res.json({ likes: post.likes })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// Social Endpoint: POST /api/posts/:id/comment (Add Comment)
router.post("/posts/:id/comment", authenticateToken, async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: "Database disconnected" })
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: "Comment text required" })

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    post.comments.push({ userId: req.user._id, text })
    await post.save()
    
    // Populate the newly added comment's user info before returning
    const populatedPost = await Post.findById(post._id).populate('comments.userId', 'username')
    res.json({ comments: populatedPost.comments })
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

// Social Endpoint: GET /api/posts (Fetch all posts for Feed)
router.get("/posts", async (req, res) => {
  if (!isDbConnected()) return res.json([])
  try {
    const posts = await Post.find()
      .populate('influencerId', 'username role')
      .populate('taggedProducts')
      .populate('comments.userId', 'username')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) { 
    res.status(500).json({ error: err.message }) 
  }
})

export default router

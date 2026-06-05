import multer from "multer"
import path from "path"

// Multer in-memory storage for handling file uploads (increased to 50MB for high-res images)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } 
})

// Multer disk storage for permanent social feed image uploads
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext)
  }
})

export const uploadDisk = multer({ 
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 } 
})

// Multer error handling middleware
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size allowed is 50MB." })
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` })
  }
  next(err)
}

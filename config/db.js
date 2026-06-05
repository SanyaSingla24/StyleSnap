import mongoose from "mongoose"

export const connectDB = async () => {
  if (process.env.MONGO_URI) {
    mongoose.set('bufferCommands', false)
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 })
      console.log("✅ MongoDB Connected")
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message)
    }
  } else {
    console.warn("⚠️ MONGO_URI not found in env variables.")
  }
}

export const isDbConnected = () => mongoose.connection.readyState === 1

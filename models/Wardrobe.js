import mongoose from "mongoose";

const wardrobeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['outfit', 'result'], default: 'result' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Wardrobe || mongoose.model("Wardrobe", wardrobeSchema);

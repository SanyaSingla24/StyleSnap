import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Tops', 'Dresses', 'Jeans', 'Kurtis', 'Other'], default: 'Other' },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  buyLink: { type: String, required: true }, // External checkout link (Shopify/Stripe)
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);

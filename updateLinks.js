import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const updateLinks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    const products = await Product.find();
    for (const p of products) {
      if (p.name.includes("Floral")) {
        p.buyLink = "https://www2.hm.com/en_in/productpage.1152069002.html";
      } else if (p.name.includes("Dress")) {
        p.buyLink = "https://www.zara.com/in/en/woman-dresses-l1066.html";
      } else if (p.name.includes("Jeans")) {
        p.buyLink = "https://www.levi.in/women/clothing/jeans";
      } else if (p.name.includes("Kurti")) {
        p.buyLink = "https://www.myntra.com/kurtis";
      }
      await p.save();
    }

    console.log("Product links updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateLinks();

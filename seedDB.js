import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Post from './models/Post.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error("❌ No MongoDB URI found! Please add MONGO_URI=<your connection string> to your .env file.");
  process.exit(1);
}

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB...");

    // --- USERS ---
    let designer = await User.findOne({ username: 'mock_designer' });
    if (!designer) {
      const salt = await bcrypt.genSalt(10);
      designer = await User.create({ username: 'mock_designer', passwordHash: await bcrypt.hash('password123', salt), role: 'designer' });
      console.log("Created mock_designer");
    }

    let influencer1 = await User.findOne({ username: 'priya_styles' });
    if (!influencer1) {
      const salt = await bcrypt.genSalt(10);
      influencer1 = await User.create({ username: 'priya_styles', passwordHash: await bcrypt.hash('password123', salt), role: 'influencer' });
      console.log("Created priya_styles");
    }

    let influencer2 = await User.findOne({ username: 'zara_vibes' });
    if (!influencer2) {
      const salt = await bcrypt.genSalt(10);
      influencer2 = await User.create({ username: 'zara_vibes', passwordHash: await bcrypt.hash('password123', salt), role: 'influencer' });
      console.log("Created zara_vibes");
    }

    let influencer3 = await User.findOne({ username: 'ananya_ootd' });
    if (!influencer3) {
      const salt = await bcrypt.genSalt(10);
      influencer3 = await User.create({ username: 'ananya_ootd', passwordHash: await bcrypt.hash('password123', salt), role: 'influencer' });
      console.log("Created ananya_ootd");
    }

    // --- PRODUCTS: Real links to actual shopping sites ---
    await Product.deleteMany({});
    console.log("Cleared existing products...");

    const products = [
      // TOPS
      {
        designerId: designer._id,
        name: "Floral Printed Top",
        description: "Breezy lightweight floral top perfect for summer days. Available in multiple sizes.",
        category: "Tops",
        price: 799,
        imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.myntra.com/tops?rawQuery=floral+printed+top"
      },
      {
        designerId: designer._id,
        name: "Striped Crop Top",
        description: "Trendy striped crop top for casual outings and brunch dates.",
        category: "Tops",
        price: 599,
        imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f52f29?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www2.hm.com/en_in/women/products/tops.html"
      },
      {
        designerId: designer._id,
        name: "Solid Cotton Shirt",
        description: "Crisp solid cotton shirt, perfect for smart-casual looks.",
        category: "Tops",
        price: 899,
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.ajio.com/s/women-shirts-tops"
      },
      // DRESSES
      {
        designerId: designer._id,
        name: "Off-Shoulder Bodycon Dress",
        description: "Stunning evening dress with an off-shoulder neckline and bodycon silhouette.",
        category: "Dresses",
        price: 1499,
        imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.ajio.com/s/women-dresses"
      },
      {
        designerId: designer._id,
        name: "Denim Midi Dress",
        description: "Chic denim midi dress perfect for brunches and casual outings.",
        category: "Dresses",
        price: 1799,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.zara.com/in/en/woman-dresses-l1066.html"
      },
      {
        designerId: designer._id,
        name: "Floral Wrap Dress",
        description: "Flattering wrap-style dress with a vibrant floral print.",
        category: "Dresses",
        price: 1299,
        imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.nykaa.com/fashion/dresses"
      },
      // JEANS
      {
        designerId: designer._id,
        name: "Classic Slim-Fit Jeans",
        description: "Timeless slim-fit jeans in classic blue denim for everyday wear.",
        category: "Jeans",
        price: 1299,
        imageUrl: "https://images.unsplash.com/photo-1542272604-780c8d52a5ce?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.levi.in/women/clothing/jeans"
      },
      {
        designerId: designer._id,
        name: "High-Rise Straight Jeans",
        description: "High-rise straight-leg jeans for an effortless, flattering look.",
        category: "Jeans",
        price: 1599,
        imageUrl: "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.hrxbrand.com/collections/women-jeans"
      },
      {
        designerId: designer._id,
        name: "Ripped Boyfriend Jeans",
        description: "Trendy ripped boyfriend jeans with a relaxed, casual fit.",
        category: "Jeans",
        price: 1199,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.amazon.in/s?k=ripped+boyfriend+jeans+for+women"
      },
      // KURTIS
      {
        designerId: designer._id,
        name: "Hand Embroidered Kurti",
        description: "Traditional cotton kurti with beautiful hand embroidery and block print detailing.",
        category: "Kurtis",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.myntra.com/kurtis"
      },
      {
        designerId: designer._id,
        name: "Anarkali Kurti Set",
        description: "Graceful Anarkali kurti with matching palazzo trousers, perfect for festive occasions.",
        category: "Kurtis",
        price: 1199,
        imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.biba.in/collections/kurtis"
      },
      {
        designerId: designer._id,
        name: "Printed Cotton Kurti",
        description: "Breezy printed cotton kurti, great for daily wear and errands.",
        category: "Kurtis",
        price: 699,
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.fabindia.com/clothes/women/kurtas-and-kurtis"
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added with real shop links!`);

    // --- FEED POSTS: Rich influencer content ---
    await Post.deleteMany({});
    console.log("Cleared existing posts...");

    const posts = [
      {
        influencerId: influencer1._id,
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
        description: "Summer is all about florals and light fabrics! This look is giving everything 🌸☀️ #OOTD #SummerVibes",
        likes: [influencer2._id, influencer3._id, designer._id],
        comments: [
          { userId: influencer2._id, text: "Obsessed with this look! 😍🔥" },
          { userId: designer._id, text: "The color palette is everything ✨" }
        ]
      },
      {
        influencerId: influencer2._id,
        imageUrl: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&q=80&w=800",
        description: "City girl energy! Street style is where my heart is 🏙️✨ Tell me your fave look in the comments!",
        likes: [influencer1._id, influencer3._id],
        comments: [
          { userId: influencer3._id, text: "You always nail street style! 👏" },
          { userId: influencer1._id, text: "That bag tho 😭❤️" }
        ]
      },
      {
        influencerId: influencer3._id,
        imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
        description: "Embracing my desi roots with this gorgeous embroidered ensemble 🪷 Kurti vibes all day every day 🙏",
        likes: [influencer1._id, designer._id],
        comments: [
          { userId: influencer1._id, text: "We LOVE a desi queen 👑🪷" },
        ]
      },
      {
        influencerId: influencer2._id,
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
        description: "Shopping spree haul drop! Which piece is your favorite? 🛍️💕 #StyleInspo #FashionHaul",
        likes: [influencer3._id],
        comments: []
      },
      {
        influencerId: influencer1._id,
        imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800",
        description: "Keeping it minimal but make it luxe 🤍 Sometimes less really is more. What's your style mantra? 💫",
        likes: [influencer2._id, influencer3._id, designer._id],
        comments: [
          { userId: influencer3._id, text: "Clean girl aesthetic at its finest! 🤍" }
        ]
      },
    ];

    await Post.insertMany(posts);
    console.log(`✅ ${posts.length} influencer posts added!`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("📌 You can log in with mock accounts: priya_styles / zara_vibes / ananya_ootd (password: password123)");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();

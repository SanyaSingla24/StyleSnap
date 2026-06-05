import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const isDnaMatch = (product, dna) => {
  if (!dna || !dna.aestheticId) return false;
  
  const matches = {
    quiet_luxury: {
      categories: ["Tops", "Jeans", "Dresses"],
      keywords: ["solid", "slim", "bodycon", "cotton", "shirt", "midi", "classic"]
    },
    streetwear: {
      categories: ["Tops", "Jeans", "Dresses"],
      keywords: ["crop", "ripped", "boyfriend", "denim", "midi", "striped", "spree", "printed"]
    },
    desi_glam: {
      categories: ["Kurtis"],
      keywords: ["kurti", "anarkali", "embroidered", "cotton"]
    },
    corporate_chic: {
      categories: ["Tops", "Jeans", "Dresses"],
      keywords: ["solid", "shirt", "bodycon", "slim", "fit", "classic"]
    },
    retro_vintage: {
      categories: ["Tops", "Jeans", "Dresses"],
      keywords: ["striped", "denim", "midi", "straight", "boyfriend", "printed"]
    },
    boho_aesthetic: {
      categories: ["Dresses", "Kurtis"],
      keywords: ["floral", "wrap", "printed", "kurti"]
    }
  };

  const config = matches[dna.aestheticId];
  if (!config) return false;

  const matchesCategory = config.categories.includes(product.category);
  const matchesKeyword = config.keywords.some(keyword => 
    product.name.toLowerCase().includes(keyword) || 
    (product.description || "").toLowerCase().includes(keyword)
  );

  return matchesCategory && matchesKeyword;
};

export default function Shop({ setPage, setSelectedOutfit, setFromShop }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [styleDNA, setStyleDNA] = useState(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("stylesnap_styledna");
    if (saved) {
      try {
        setStyleDNA(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse Style DNA in Shop:", err);
      }
    }
  }, []);

  const categories = ["All", ...(styleDNA ? ["🧬 For You"] : []), "Tops", "Dresses", "Jeans", "Kurtis"];
  
  const currentUserId = localStorage.getItem("stylesnap_userid");
  const token = localStorage.getItem("stylesnap_token");
  
  // Fallback products shown when DB has no products — all with real external buy links
  const mockProducts = [
    {
      _id: 'm1',
      name: "Floral Printed Top",
      category: "Tops",
      price: 799,
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
      description: "Lightweight floral top perfect for summer.",
      buyLink: "https://www.myntra.com/tops?rawQuery=floral%20printed%20top"
    },
    {
      _id: 'm2',
      name: "Off-Shoulder Bodycon Dress",
      category: "Dresses",
      price: 1499,
      imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800",
      description: "Elegant evening dress with a classic silhouette.",
      buyLink: "https://www.ajio.com/s/women-dresses"
    },
    {
      _id: 'm3',
      name: "Classic Slim-Fit Jeans",
      category: "Jeans",
      price: 1299,
      imageUrl: "https://images.unsplash.com/photo-1542272604-780c8d52a5ce?auto=format&fit=crop&q=80&w=800",
      description: "Comfortable denim jeans for everyday wear.",
      buyLink: "https://www.levi.in/women/clothing/jeans"
    },
    {
      _id: 'm4',
      name: "Hand Embroidered Kurti",
      category: "Kurtis",
      price: 999,
      imageUrl: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&q=80&w=800",
      description: "Traditional cotton kurti with beautiful hand embroidery.",
      buyLink: "https://www.myntra.com/kurtis"
    },
    {
      _id: 'm5',
      name: "Striped Crop Top",
      category: "Tops",
      price: 599,
      imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f52f29?auto=format&fit=crop&q=80&w=800",
      description: "Trendy striped crop top for casual outings.",
      buyLink: "https://www2.hm.com/en_in/women/products/tops.html"
    },
    {
      _id: 'm6',
      name: "Denim Midi Dress",
      category: "Dresses",
      price: 1799,
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
      description: "Chic denim midi dress perfect for brunch.",
      buyLink: "https://www.zara.com/in/en/woman-dresses-l1066.html"
    },
    {
      _id: 'm7',
      name: "High-Rise Straight Jeans",
      category: "Jeans",
      price: 1599,
      imageUrl: "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&q=80&w=800",
      description: "High-rise straight-leg jeans for an effortless look.",
      buyLink: "https://www.hrxbrand.com/collections/women-jeans"
    },
    {
      _id: 'm8',
      name: "Anarkali Kurti Set",
      category: "Kurtis",
      price: 1199,
      imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800",
      description: "Graceful Anarkali kurti with palazzo trousers.",
      buyLink: "https://www.indiamart.com/proddetail/anarkali-kurti.html"
    }
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        console.error("Shop API returned non-array:", data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayedProducts = (products.length > 0 ? products : mockProducts).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "🧬 For You") {
      matchesCategory = isDnaMatch(p, styleDNA);
    } else {
      matchesCategory = p.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full px-6 py-4 animate-fade-in">
      {/* HEADER */}
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          The Style Shop
        </h1>
        <p className="text-sm text-gray-655 font-medium">
          Discover and try on clothes from top designers.
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto hide-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none text-sm font-medium transition-all"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-6xl mb-4 block">🛍️</span>
          <h3 className="text-2xl font-bold text-black">No Products Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* IMAGE CONTAINER */}
              <div className="h-56 w-full rounded-2xl overflow-hidden mb-4 bg-gray-50 relative border border-gray-100 flex items-center justify-center p-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x400/f9f9f9/999?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                {isDnaMatch(product, styleDNA) && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-yellow-300 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-yellow-400">
                      🧬 DNA Match
                    </span>
                  </div>
                )}
                {product.designerId && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      By @{product.designerId.username}
                    </span>
                    {product.designerId._id === currentUserId && (
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                        title="Delete Product"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* PRODUCT DETAILS */}
              <div className="mb-5 flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">
                  {product.name}
                </h3>
                <p className="text-yellow-600 font-extrabold text-lg mb-2">
                  ${product.price}
                </p>
                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => {
                    setSelectedOutfit({ name: product.name, image: product.imageUrl });
                    setFromShop(true);
                    setPage("AI Try-On");
                  }}
                  className="flex-1 bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  ✨ Try On
                </button>
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-yellow-400 text-black py-2.5 rounded-xl font-semibold hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  💳 Buy
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

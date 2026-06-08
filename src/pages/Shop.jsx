import { useState, useEffect } from "react";
import { Loader2, Search, ShoppingBag, Sparkles } from "lucide-react";

const isDnaMatch = (product, dna) => {
  if (!dna || !dna.aestheticId) return false;
  const matches = {
    quiet_luxury:  { categories: ["Tops","Jeans","Dresses"], keywords: ["solid","slim","bodycon","cotton","shirt","midi","classic"] },
    streetwear:    { categories: ["Tops","Jeans","Dresses"], keywords: ["crop","ripped","boyfriend","denim","midi","striped","spree","printed"] },
    desi_glam:     { categories: ["Kurtis"],                 keywords: ["kurti","anarkali","embroidered","cotton"] },
    corporate_chic:{ categories: ["Tops","Jeans","Dresses"], keywords: ["solid","shirt","bodycon","slim","fit","classic"] },
    retro_vintage: { categories: ["Tops","Jeans","Dresses"], keywords: ["striped","denim","midi","straight","boyfriend","printed"] },
    boho_aesthetic:{ categories: ["Dresses","Kurtis"],       keywords: ["floral","wrap","printed","kurti"] }
  };
  const config = matches[dna.aestheticId];
  if (!config) return false;
  const matchesCategory = config.categories.includes(product.category);
  const matchesKeyword = config.keywords.some(kw =>
    product.name.toLowerCase().includes(kw) || (product.description || "").toLowerCase().includes(kw)
  );
  return matchesCategory && matchesKeyword;
};

export default function Shop({ setPage, setSelectedOutfit, setFromShop }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [styleDNA, setStyleDNA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});

  const currentUserId = localStorage.getItem("stylesnap_userid");
  const token = localStorage.getItem("stylesnap_token");

  useEffect(() => {
    const saved = localStorage.getItem("stylesnap_styledna");
    if (saved) { try { setStyleDNA(JSON.parse(saved)); } catch {} }
  }, []);

  const mockProducts = [
    { _id: 'm1', name: "Floral Printed Top", category: "Tops", price: 799, imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.myntra.com/tops?rawQuery=floral%20printed%20top" },
    { _id: 'm2', name: "Off-Shoulder Bodycon Dress", category: "Dresses", price: 1499, imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.ajio.com/s/women-dresses" },
    { _id: 'm3', name: "Classic Slim-Fit Jeans", category: "Jeans", price: 1299, imageUrl: "https://images.unsplash.com/photo-1542272604-780c8d52a5ce?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.levi.in/women/clothing/jeans" },
    { _id: 'm4', name: "Hand Embroidered Kurti", category: "Kurtis", price: 999, imageUrl: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.myntra.com/kurtis" },
    { _id: 'm5', name: "Striped Crop Top", category: "Tops", price: 599, imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f52f29?auto=format&fit=crop&q=80&w=600", buyLink: "https://www2.hm.com/en_in/women/products/tops.html" },
    { _id: 'm6', name: "Denim Midi Dress", category: "Dresses", price: 1799, imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.zara.com/in/en/woman-dresses-l1066.html" },
    { _id: 'm7', name: "High-Rise Straight Jeans", category: "Jeans", price: 1599, imageUrl: "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.hrxbrand.com/collections/women-jeans" },
    { _id: 'm8', name: "Anarkali Kurti Set", category: "Kurtis", price: 1199, imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.indiamart.com/proddetail/anarkali-kurti.html" },
    { _id: 'm9', name: "White Linen Shirt", category: "Tops", price: 899, imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.myntra.com/shirts" },
    { _id: 'm10', name: "Flowy Maxi Dress", category: "Dresses", price: 2099, imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.ajio.com/s/women-dresses" },
    { _id: 'm11', name: "Boyfriend Jeans", category: "Jeans", price: 1399, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.levi.in/women/clothing/jeans" },
    { _id: 'm12', name: "Embroidered Cotton Kurti", category: "Kurtis", price: 849, imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600", buyLink: "https://www.myntra.com/kurtis" },
  ];

  const categories = ["All", ...(styleDNA ? ["🧬 For You"] : []), "Tops", "Dresses", "Jeans", "Kurtis"];

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only keep DB products that have real images and buy links
        const validDbProducts = data.filter(p => 
          p.imageUrl && p.buyLink
        );
        setProducts(validDbProducts);
      } else {
        setProducts([]);
      }
    } catch { setProducts([]); }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) setProducts(prev => prev.filter(p => p._id !== productId));
      else { const data = await res.json(); alert(data.error || "Failed to delete."); }
    } catch (err) { console.error(err); }
  };

  const displayedProducts = [...products, ...mockProducts].filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = selectedCategory === "All" ? true :
                          selectedCategory === "🧬 For You" ? isDnaMatch(p, styleDNA) :
                          p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-0.5">
            Style Shop 🛍️
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {displayedProducts.length} items · discover, try on, and buy
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-52 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 rounded-xl ring-1 ring-gray-200 dark:ring-zinc-700 focus:ring-2 focus:ring-[#FBBF24] outline-none text-xs font-medium transition-all dark:text-gray-200 border-none"
          />
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === cat
                ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 hover:border-[#FBBF24]/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
        </div>

      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <ShoppingBag className="w-8 h-8 text-gray-200 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No products found</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1 text-xs">Try a different filter or search term</p>
        </div>

      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {displayedProducts.map((product) => {
            const isMatch = isDnaMatch(product, styleDNA);
            return (
              <div
                key={product._id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col group overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative aspect-square w-full bg-gray-50 dark:bg-zinc-950 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/400x500/f5f5f5/999?text=${encodeURIComponent(product.name)}`;
                    }}
                  />

                  {/* DNA MATCH BADGE */}
                  {isMatch && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-[#FBBF24] text-black text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        🧬 Match
                      </span>
                    </div>
                  )}

                  {/* DESIGNER BADGE */}
                  {product.designerId && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 flex items-center justify-between">
                      <span className="text-white text-[8px] font-bold uppercase tracking-wide">
                        @{product.designerId.username || product.designerId}
                      </span>
                      {product.designerId._id === currentUserId && (
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-white/70 hover:text-red-400 text-[8px] font-bold transition-colors"
                        >
                          ✕ Delete
                        </button>
                      )}
                    </div>
                  )}

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={() => setWishlist(prev => ({ ...prev, [product._id]: !prev[product._id] }))}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm text-xs"
                  >
                    {wishlist[product._id] ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* DETAILS */}
                <div className="p-2 flex flex-col flex-1">
                  <h3 className="font-bold text-[10px] text-gray-900 dark:text-white mb-0.5 leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[#FBBF24] font-extrabold text-[10px] mb-2">
                    ₹{product.price}
                  </p>
                  {/* BUTTONS */}
                  <div className="flex gap-1 mt-auto">
                    <button
                      onClick={() => {
                        setSelectedOutfit({ name: product.name, image: product.imageUrl });
                        setFromShop(true);
                        setPage("AI Try-On");
                      }}
                      className="flex-1 bg-black dark:bg-white text-white dark:text-black py-1.5 rounded-lg font-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-0.5 text-[8px] uppercase tracking-wide"
                    >
                      <Sparkles className="w-2 h-2" />
                      Try
                    </button>
                    <a
                      href={product.buyLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-[#FBBF24] text-black py-1.5 rounded-lg font-black hover:bg-yellow-500 transition-colors flex items-center justify-center text-[8px] uppercase tracking-wide"
                    >
                      Buy
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Loader2, Shirt, Trash2, Plus } from "lucide-react";

export default function Wardrobe({ setPage }) {
  const username = localStorage.getItem("stylesnap_username");
  const userId = localStorage.getItem("stylesnap_userid");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Accessories"];

  useEffect(() => {
    if (userId) fetchWardrobe(userId);
  }, [userId]);

  const fetchWardrobe = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wardrobe/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
      else setItems([]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Remove this from your wardrobe?")) return;
    try {
      const res = await fetch(`/api/wardrobe/${itemId}`, { method: "DELETE" });
      if (res.ok) setItems(prev => prev.filter(item => item._id !== itemId));
      else alert("Failed to delete item.");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeCategory === "All") return true;
    const t = (item.type || "").toLowerCase();
    const c = (item.category || "").toLowerCase();
    if (activeCategory === "Tops") return t === "upper_body" || c === "tops";
    if (activeCategory === "Bottoms") return t === "lower_body" || c === "bottoms";
    if (activeCategory === "Dresses") return t === "dresses" || c === "dresses";
    if (activeCategory === "Shoes") return c === "shoes";
    if (activeCategory === "Accessories") return c === "accessories";
    return false;
  });

  return (
    <div className="animate-fade-in text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-0.5">
            My Wardrobe
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            @{username} · {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setPage("AI Try-On")}
          className="flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#FBBF24] hover:text-black transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to Wardrobe
        </button>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 active:scale-95 ${
              activeCategory === cat
                ? "bg-[#FBBF24] text-black shadow-sm"
                : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-800 hover:border-[#FBBF24]/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="font-bold tracking-widest uppercase text-[10px]">Syncing Wardrobe...</p>
        </div>

      ) : items.length === 0 ? (
        /* EMPTY STATE */
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center max-w-sm mx-auto overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300")` }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FBBF24]/20 flex items-center justify-center mb-4">
              <Shirt className="w-8 h-8 text-[#FBBF24]" />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1.5">Your wardrobe is empty</h3>
            <p className="text-gray-400 dark:text-gray-500 max-w-xs mx-auto mb-5 text-xs font-medium leading-relaxed">
              Head to the AI Try-On studio to generate and save your favorite looks here.
            </p>
            <button
              onClick={() => setPage("AI Try-On")}
              className="bg-[#FBBF24] text-black hover:bg-yellow-500 px-5 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
            >
              Go to AI Studio ✨
            </button>
          </div>
        </div>

      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center max-w-sm mx-auto">
          <span className="text-3xl mb-3">🔍</span>
          <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1">No items in "{activeCategory}"</h3>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium mb-4">Try selecting a different category.</p>
          <button
            onClick={() => setActiveCategory("All")}
            className="bg-[#FBBF24] text-black hover:bg-yellow-500 px-4 py-2 rounded-xl font-black text-xs tracking-wider uppercase transition-all active:scale-95"
          >
            Show All
          </button>
        </div>

      ) : (
        /* GRID */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredItems.map(item => (
            <div
              key={item._id}
              className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* IMAGE */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-zinc-950">
                <img
                  src={item.imageUrl}
                  alt="Saved Outfit"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
              </div>

              {/* TYPE BADGE */}
              {item.type && (
                <div className="absolute top-2 left-2 bg-black/65 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {item.type.replace("_", " ")}
                </div>
              )}

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteItem(item._id)}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                title="Remove from wardrobe"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              {/* BOTTOM INFO */}
              <div className="p-2 border-t border-gray-50 dark:border-zinc-800">
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                  {item.type ? item.type.replace(/_/g, " ") : "Outfit"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

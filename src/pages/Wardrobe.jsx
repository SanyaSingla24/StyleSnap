import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Wardrobe({ setPage }) {
  const username = localStorage.getItem("stylesnap_username");
  const userId = localStorage.getItem("stylesnap_userid");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchWardrobe(userId);
    }
  }, [userId]);

  const fetchWardrobe = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wardrobe/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
        console.error("Wardrobe API returned non-array:", data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this from your wardrobe?")) return;
    try {
      const res = await fetch(`/api/wardrobe/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setItems(prev => prev.filter(item => item._id !== itemId));
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting item.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-black mb-2">My Wardrobe</h2>
          <p className="text-gray-500 font-medium">Logged in as <span className="font-bold text-black">@{username}</span></p>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-bold tracking-widest uppercase text-xs">Syncing from Cloud...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center">
          <span className="text-6xl mb-4">👕</span>
          <h3 className="text-xl font-bold text-black mb-2">Your Wardrobe is Empty</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Head over to the AI Try-On studio to generate and save your favorite styles to the cloud.</p>
          <button 
            onClick={() => setPage("AI Try-On")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            Go to Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item._id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                <img 
                  src={item.imageUrl} 
                  alt="Saved Outfit" 
                  className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105" 
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {item.type}
              </div>
              <button 
                onClick={() => deleteItem(item._id)}
                className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                title="Delete from wardrobe"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

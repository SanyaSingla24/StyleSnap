import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CreatorStudio() {
  const role = localStorage.getItem("stylesnap_role");
  const userId = localStorage.getItem("stylesnap_userid");
  const username = localStorage.getItem("stylesnap_username");

  const [loading, setLoading] = useState(false);

  // Designer Form State
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productLink, setProductLink] = useState("");

  // Influencer Form State
  const [postImage, setPostImage] = useState("");
  const [postDesc, setPostDesc] = useState("");

  const handleCreateProduct = async () => {
    if (!productName || !productPrice || !productImage || !productLink) return alert("Please fill all required fields");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designerId: userId,
          name: productName,
          description: productDesc,
          price: Number(productPrice),
          imageUrl: productImage,
          buyLink: productLink
        })
      });
      if (res.ok) {
        alert("✅ Product published to the Shop!");
        setProductName(""); setProductDesc(""); setProductPrice(""); setProductImage(""); setProductLink("");
      } else alert("❌ Failed to publish product.");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!postImage) return alert("Please provide an image URL");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencerId: userId,
          imageUrl: postImage,
          description: postDesc
        })
      });
      if (res.ok) {
        alert("✅ Post published to The Feed!");
        setPostImage(""); setPostDesc("");
      } else alert("❌ Failed to publish post.");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  if (role === "shopper") {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white rounded-[2.5rem] text-center border border-gray-100 shadow-sm animate-fade-in">
        <span className="text-6xl mb-4 block">🔒</span>
        <h2 className="text-3xl font-extrabold text-black mb-2">Creator Access Restricted</h2>
        <p className="text-gray-500 font-medium max-w-md mx-auto">
          The Creator Studio is only available to Fashion Influencers and Brands/Designers.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-black mb-2">
          {role === "designer" ? "Designer Studio 🧵" : "Influencer Studio ✨"}
        </h2>
        <p className="text-gray-500 font-medium">Welcome back, <span className="font-bold text-black">@{username}</span>.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
        
        {role === "designer" ? (
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">List a New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name *</label>
                <input type="text" value={productName} onChange={e=>setProductName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" placeholder="e.g. Vintage Leather Jacket" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price ($) *</label>
                  <input type="number" value={productPrice} onChange={e=>setProductPrice(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" placeholder="199.99" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">External Buy Link *</label>
                  <input type="text" value={productLink} onChange={e=>setProductLink(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" placeholder="https://yourstore.com/checkout" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Image URL *</label>
                <input type="text" value={productImage} onChange={e=>setProductImage(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea value={productDesc} onChange={e=>setProductDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black min-h-[100px]" placeholder="Tell us about this item..."></textarea>
              </div>
              <button 
                onClick={handleCreateProduct}
                disabled={loading}
                className="mt-6 w-full bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Publish Product 🚀"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">Create a New Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Outfit Image URL *</label>
                <input type="text" value={postImage} onChange={e=>setPostImage(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black" placeholder="https://example.com/my-outfit.jpg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Caption</label>
                <textarea value={postDesc} onChange={e=>setPostDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black min-h-[100px]" placeholder="How are we feeling about this fit? 🔥"></textarea>
              </div>
              {/* Product tagging would go here in v2 */}
              <button 
                onClick={handleCreatePost}
                disabled={loading}
                className="mt-6 w-full bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Post to Feed 📸"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

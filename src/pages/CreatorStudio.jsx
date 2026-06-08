import { useState, useEffect } from "react";
import { Loader2, UploadCloud, Sparkles, Shirt, Trash2 } from "lucide-react";

export default function CreatorStudio() {
  const role = localStorage.getItem("stylesnap_role");
  const userId = localStorage.getItem("stylesnap_userid");
  const username = localStorage.getItem("stylesnap_username");
  const token = localStorage.getItem("stylesnap_token");

  const [loading, setLoading] = useState(false);

  // Designer Form State
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productLink, setProductLink] = useState("");
  const [productCategory, setProductCategory] = useState("Other");

  // Influencer Form State
  const [postImage, setPostImage] = useState("");
  const [postDesc, setPostDesc] = useState("");

  // Common UI State for Image Upload
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // My Listings State
  const [myProducts, setMyProducts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [fetchingListings, setFetchingListings] = useState(false);

  useEffect(() => {
    if (role === "designer") {
      fetchMyProducts();
    } else if (role === "influencer") {
      fetchMyPosts();
    }
  }, [role, userId]);

  const fetchMyProducts = async () => {
    setFetchingListings(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data.filter(
          p => p.designerId && (p.designerId._id === userId || p.designerId === userId)
        );
        setMyProducts(filtered);
      }
    } catch (err) {
      console.error("Error fetching designer products:", err);
    } finally {
      setFetchingListings(false);
    }
  };

  const fetchMyPosts = async () => {
    setFetchingListings(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data.filter(
          p => p.influencerId && (p.influencerId._id === userId || p.influencerId === userId)
        );
        setMyPosts(filtered);
      }
    } catch (err) {
      console.error("Error fetching influencer posts:", err);
    } finally {
      setFetchingListings(false);
    }
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (role === "designer") {
          setProductImage(data.imageUrl);
        } else {
          setPostImage(data.imageUrl);
        }
      } else {
        alert("❌ Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image file.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async () => {
    const imgUrl = productImage || previewImage;
    if (!productName || !productPrice || !imgUrl || !productLink) {
      return alert("Please fill all required fields and upload an image");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designerId: userId,
          name: productName,
          description: productDesc,
          price: Number(productPrice),
          imageUrl: imgUrl,
          buyLink: productLink,
          category: productCategory
        })
      });
      if (res.ok) {
        alert("✅ Product published to the Shop!");
        setProductName("");
        setProductDesc("");
        setProductPrice("");
        setProductImage("");
        setProductLink("");
        setProductCategory("Other");
        setPreviewImage("");
        fetchMyProducts();
      } else {
        alert("❌ Failed to publish product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    const imgUrl = postImage || previewImage;
    if (!imgUrl) return alert("Please upload an image for your post");
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencerId: userId,
          imageUrl: imgUrl,
          description: postDesc
        })
      });
      if (res.ok) {
        alert("✅ Post published to The Feed!");
        setPostImage("");
        setPostDesc("");
        setPreviewImage("");
        fetchMyPosts();
      } else {
        alert("❌ Failed to publish post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMyProducts(prev => prev.filter(p => p._id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMyPosts(prev => prev.filter(p => p._id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (role !== "designer") {
    return (
      <div className="max-w-sm mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl text-center border border-gray-150 dark:border-zinc-800 shadow-sm animate-fade-in mt-8">
        <span className="text-4xl mb-3 block">🔒</span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">Creator Access Restricted</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium max-w-xs mx-auto">
          The Creator Studio is only available to Brands and Designers.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in text-left">
      <div className="mb-5 border-b border-gray-150 dark:border-zinc-800 pb-3">
        <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-0.5">
          {role === "designer" ? "Designer Studio 🧵" : "Influencer Studio ✨"}
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">
          Welcome back, <span className="text-[#FBBF24]">@{username}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left Side: Form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm">
          {role === "designer" ? (
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">List a New Product</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Product Name *</label>
                  <input 
                    type="text" 
                    value={productName} 
                    onChange={e=>setProductName(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-250 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 font-semibold" 
                    placeholder="e.g. Vintage Leather Jacket" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Price ($) *</label>
                    <input 
                      type="number" 
                      value={productPrice} 
                      onChange={e=>setProductPrice(e.target.value)} 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-250 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 font-semibold" 
                      placeholder="199.99" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Category *</label>
                    <select
                      value={productCategory}
                      onChange={e=>setProductCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-250 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent text-gray-800 dark:text-zinc-200 font-semibold"
                    >
                      <option value="Tops">Tops</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Jeans">Jeans</option>
                      <option value="Kurtis">Kurtis</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">External Buy Link *</label>
                  <input 
                    type="text" 
                    value={productLink} 
                    onChange={e=>setProductLink(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-250 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 font-semibold" 
                    placeholder="https://yourstore.com/checkout" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Product Image *</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleImageFile(file); }}
                    onClick={() => document.getElementById("product-file-input").click()}
                    className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50/50 dark:bg-zinc-800/20 ${
                      isDragging 
                        ? "border-[#FBBF24] bg-yellow-500/5 dark:bg-yellow-500/5" 
                        : "border-gray-200 dark:border-zinc-700 hover:border-yellow-400"
                    }`}
                  >
                    <input 
                      type="file"
                      id="product-file-input"
                      accept="image/*"
                      onChange={(e) => { const file = e.target.files[0]; if (file) handleImageFile(file); }}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="animate-spin text-[#FBBF24] w-8 h-8" />
                        <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">Uploading image...</p>
                      </div>
                    ) : previewImage ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <img src={previewImage} alt="Preview" className="max-h-32 object-contain rounded-lg border border-gray-200 dark:border-zinc-800" />
                        <span className="text-[10px] bg-black/5 dark:bg-white/5 text-gray-500 dark:text-zinc-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Change Image
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-zinc-500 py-2">
                        <UploadCloud className="w-10 h-10 stroke-[1.5]" />
                        <div>
                          <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">Drag and drop file here, or click to upload</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">Supports PNG, JPG, JPEG</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={productDesc} 
                    onChange={e=>setProductDesc(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-250 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 font-semibold min-h-[100px]" 
                    placeholder="Tell us about this item..."
                  ></textarea>
                </div>

                <button 
                  onClick={handleCreateProduct}
                  disabled={loading}
                  className="mt-6 w-full bg-[#FBBF24] text-[#1C1C1C] px-8 py-3.5 rounded-full font-bold uppercase tracking-wider hover:bg-yellow-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "PUBLISH PRODUCT 🚀"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Create a New Post</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Outfit Image *</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleImageFile(file); }}
                    onClick={() => document.getElementById("post-file-input").click()}
                    className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50/50 dark:bg-zinc-800/20 ${
                      isDragging 
                        ? "border-[#FBBF24] bg-yellow-500/5 dark:bg-yellow-500/5" 
                        : "border-gray-200 dark:border-zinc-700 hover:border-yellow-400"
                    }`}
                  >
                    <input 
                      type="file"
                      id="post-file-input"
                      accept="image/*"
                      onChange={(e) => { const file = e.target.files[0]; if (file) handleImageFile(file); }}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="animate-spin text-[#FBBF24] w-8 h-8" />
                        <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">Uploading image...</p>
                      </div>
                    ) : previewImage ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <img src={previewImage} alt="Preview" className="max-h-32 object-contain rounded-lg border border-gray-200 dark:border-zinc-800" />
                        <span className="text-[10px] bg-black/5 dark:bg-white/5 text-gray-500 dark:text-zinc-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Change Image
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-zinc-500 py-2">
                        <UploadCloud className="w-10 h-10 stroke-[1.5]" />
                        <div>
                          <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">Drag and drop file here, or click to upload</p>
                          <p className="text-[10px] text-gray-450 dark:text-zinc-500 mt-0.5">Supports PNG, JPG, JPEG</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Caption</label>
                  <textarea 
                    value={postDesc} 
                    onChange={e=>setPostDesc(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-250 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 font-semibold min-h-[100px]" 
                    placeholder="How are we feeling about this fit? 🔥"
                  ></textarea>
                </div>

                <button 
                  onClick={handleCreatePost}
                  disabled={loading}
                  className="mt-6 w-full bg-[#FBBF24] text-[#1C1C1C] px-8 py-3.5 rounded-full font-bold uppercase tracking-wider hover:bg-yellow-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "POST TO FEED 📸"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-4 bg-gray-50/50 dark:bg-zinc-800/10 p-6 rounded-2xl border border-gray-150 dark:border-zinc-800/50">
          <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 justify-center lg:justify-start">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            Live Preview Card
          </h3>

          {role === "designer" ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-150 dark:border-zinc-800 shadow-md flex flex-col group max-w-sm mx-auto w-full">
              <div className="h-56 w-full rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-zinc-800/30 relative border border-gray-100 dark:border-zinc-800 flex items-center justify-center p-2">
                {productImage || previewImage ? (
                  <img
                    src={previewImage || productImage}
                    alt={productName || "Product Name"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-300 dark:text-zinc-700 flex flex-col items-center gap-2">
                    <Shirt className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider">No Image Selected</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    By @{username}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-[#FBBF24] text-[#1C1C1C] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {productCategory}
                  </span>
                </div>
              </div>
              <div className="mb-5 flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 leading-tight truncate">
                  {productName || "Untitled Designer Piece"}
                </h3>
                <p className="text-[#FBBF24] font-extrabold text-lg mb-2">
                  ${productPrice || "0.00"}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed h-8">
                  {productDesc || "Describe your creation to shoppers..."}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-black dark:bg-zinc-800 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-xs opacity-75 cursor-not-allowed">
                  ✨ Try On
                </button>
                <button className="flex-1 bg-[#FBBF24] text-[#1C1C1C] py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-xs opacity-75 cursor-not-allowed">
                  💳 Buy
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-md overflow-hidden flex flex-col max-w-sm mx-auto w-full">
              <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                    {username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">@{username}</h4>
                      <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        👑 Spotlight
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">Preview Mode</p>
                  </div>
                </div>
              </div>
              <div className="w-full h-56 bg-gray-50 dark:bg-zinc-800/30 flex items-center justify-center relative border-b border-gray-100 dark:border-zinc-800">
                {postImage || previewImage ? (
                  <img
                    src={previewImage || postImage}
                    alt="Outfit Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300 dark:text-zinc-700 flex flex-col items-center gap-2">
                    <UploadCloud className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider">No Image Selected</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 cursor-not-allowed">🤍 0</span>
                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 cursor-not-allowed">💬 0</span>
                  <span className="text-xs font-bold text-gray-500 cursor-not-allowed">🚀</span>
                </div>
                <p className="text-xs text-gray-800 dark:text-zinc-300 leading-relaxed min-h-[40px]">
                  <span className="font-bold mr-1.5 text-gray-900 dark:text-white">@{username}</span>
                  {postDesc || "Type a caption to inspire your followers..."}
                </p>
                <button className="w-full mt-4 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider opacity-75 cursor-not-allowed">
                  ✨ Try This Look
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid below: My Listings */}
      <div className="mt-12 border-t border-gray-150 dark:border-zinc-800 pt-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">
          {role === "designer" ? "My Shop Listings 🛍️" : "My Feed Posts 📸"}
        </h3>

        {fetchingListings ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FBBF24]" />
          </div>
        ) : role === "designer" ? (
          myProducts.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-zinc-800/10 rounded-2xl border border-gray-150 dark:border-zinc-800">
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">You haven't listed any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myProducts.map((product) => (
                <div key={product._id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-150 dark:border-zinc-800 shadow-sm flex flex-col group relative">
                  <div className="h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 flex items-center justify-center relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate mb-0.5">{product.name}</h4>
                  <span className="text-[#FBBF24] font-black text-sm mb-1">${product.price}</span>
                  <span className="text-[10px] text-gray-405 dark:text-zinc-550">{product.category}</span>
                </div>
              ))}
            </div>
          )
        ) : (
          myPosts.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-zinc-800/10 rounded-2xl border border-gray-150 dark:border-zinc-800">
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">You haven't created any posts yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myPosts.map((post) => (
                <div key={post._id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-150 dark:border-zinc-800 shadow-sm flex flex-col group relative">
                  <div className="h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 flex items-center justify-center relative">
                    <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{post.description || "No caption"}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

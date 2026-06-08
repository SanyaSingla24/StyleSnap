import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

export default function Feed({ setPage, setSelectedOutfit, setFromShop }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("stylesnap_userid");
  const currentUsername = localStorage.getItem("stylesnap_username");
  const token = localStorage.getItem("stylesnap_token");
  const [commentInputs, setCommentInputs] = useState({});
  const [localMockPosts, setLocalMockPosts] = useState(null);
  const [heartBurst, setHeartBurst] = useState({}); // { postId: true } when animating
  const [likeAnimating, setLikeAnimating] = useState({}); // button pop per post
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null); // { postId, index }
  const [uploadHotspots, setUploadHotspots] = useState([]);
  const [showTagForm, setShowTagForm] = useState(null); // { x, y }
  const [tagFormName, setTagFormName] = useState("");
  const [tagFormPrice, setTagFormPrice] = useState("");
  const [tagFormLink, setTagFormLink] = useState("");

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    setShowTagForm({ x, y });
    setTagFormName("");
    setTagFormPrice("");
    setTagFormLink("");
  };

  const addHotspotTag = () => {
    if (!tagFormName.trim() || !tagFormPrice) return;
    
    setUploadHotspots(prev => [
      ...prev,
      {
        x: showTagForm.x,
        y: showTagForm.y,
        name: tagFormName.trim(),
        price: parseFloat(tagFormPrice),
        buyLink: tagFormLink.trim() || "https://www.google.com/search?tbm=shop&q=" + encodeURIComponent(tagFormName)
      }
    ]);
    
    setShowTagForm(null);
  };

  // Hotspot coordinates mapping for mock influencer posts
  const POST_HOTSPOTS = {
    mp1: [
      {
        name: "Oversized Urban Bomber Jacket",
        price: 1899,
        x: 52,
        y: 40,
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www2.hm.com/en_in/women/products/jackets-coats.html"
      }
    ],
    mp2: [
      {
        name: "Streetwear White Crop Top",
        price: 599,
        x: 48,
        y: 38,
        imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f52f29?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www2.hm.com/en_in/women/products/tops.html"
      },
      {
        name: "Classic Slim-Fit Jeans",
        price: 1299,
        x: 50,
        y: 65,
        imageUrl: "https://images.unsplash.com/photo-1542272604-780c8d52a5ce?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.levi.in/women/clothing/jeans"
      }
    ],
    mp3: [
      {
        name: "Embroidered Desi Kurti",
        price: 999,
        x: 50,
        y: 45,
        imageUrl: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.myntra.com/kurtis"
      }
    ],
    mp4: [
      {
        name: "Denim Utility Midi Dress",
        price: 1799,
        x: 45,
        y: 50,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.zara.com/in/en/woman-dresses-l1066.html"
      }
    ],
    mp5: [
      {
        name: "Minimal Luxe Trench Coat",
        price: 2499,
        x: 52,
        y: 36,
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.ajio.com/s/women-jackets-coats"
      },
      {
        name: "High-Rise Straight Jeans",
        price: 1599,
        x: 53,
        y: 70,
        imageUrl: "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&q=80&w=800",
        buyLink: "https://www.hrxbrand.com/collections/women-jeans"
      }
    ]
  };

  const getHotspotsForPost = (post) => {
    // If it's a mock post, return mock hotspots directly
    if (post._id.startsWith('mp')) {
      return POST_HOTSPOTS[post._id] || [];
    }
    
    // Check if it's one of the seeded mock posts by matching the image URL prefix
    const match = Object.keys(POST_HOTSPOTS).find(key => {
      const mockImg = mockPosts.find(mp => mp._id === key)?.imageUrl?.split('?')[0];
      return mockImg && post.imageUrl && post.imageUrl.includes(mockImg);
    });
    if (match) {
      return POST_HOTSPOTS[match];
    }
    
    if (post.hotspots && post.hotspots.length > 0) {
      return post.hotspots;
    }
    
    if (post.taggedProducts && post.taggedProducts.length > 0) {
      return post.taggedProducts.map((prod, idx) => {
        const xCoords = [50, 45, 55];
        const yCoords = [40, 60, 50];
        return {
          name: prod.name,
          price: prod.price,
          imageUrl: prod.imageUrl,
          buyLink: prod.buyLink,
          x: xCoords[idx % xCoords.length],
          y: yCoords[idx % yCoords.length]
        };
      });
    }
    return [];
  };

  // Fallback mock posts shown when DB has no posts
  const mockPosts = [
    {
      _id: 'mp1',
      influencerId: { username: 'priya_styles', role: 'influencer' },
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
      description: 'Summer is all about florals and light fabrics! This look is giving everything 🌸☀️ #OOTD #SummerVibes',
      likes: ['u1', 'u2', 'u3'],
      comments: [
        { userId: { username: 'zara_vibes' }, text: 'Obsessed with this look! 😍🔥' },
        { userId: { username: 'ananya_ootd' }, text: 'The color palette is everything ✨' },
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mp2',
      influencerId: { username: 'zara_vibes', role: 'influencer' },
      imageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&q=80&w=800',
      description: 'City girl energy! Street style is where my heart is 🏙️✨ Tell me your fave look in the comments!',
      likes: ['u1', 'u3'],
      comments: [
        { userId: { username: 'ananya_ootd' }, text: 'You always nail street style! 👏' },
        { userId: { username: 'priya_styles' }, text: 'That bag tho 😭❤️' },
      ],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mp3',
      influencerId: { username: 'ananya_ootd', role: 'influencer' },
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
      description: 'Embracing my desi roots with this gorgeous embroidered ensemble 🪷 Kurti vibes all day every day 🙏',
      likes: ['u1', 'u2'],
      comments: [
        { userId: { username: 'priya_styles' }, text: 'We LOVE a desi queen 👑🪷' },
      ],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mp4',
      influencerId: { username: 'zara_vibes', role: 'influencer' },
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
      description: 'Shopping spree haul drop! Which piece is your favorite? 🛍️💕 #StyleInspo #FashionHaul',
      likes: ['u3'],
      comments: [],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mp5',
      influencerId: { username: 'priya_styles', role: 'influencer' },
      imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800',
      description: 'Keeping it minimal but make it luxe 🤍 Sometimes less really is more. What’s your style mantra? 💫',
      likes: ['u1', 'u2', 'u3'],
      comments: [
        { userId: { username: 'ananya_ootd' }, text: 'Clean girl aesthetic at its finest! 🤍' },
      ],
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
        console.error("Feed API returned non-array:", data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const triggerHeartBurst = (postId) => {
    setHeartBurst(prev => ({ ...prev, [postId]: true }));
    setLikeAnimating(prev => ({ ...prev, [postId]: true }));
    setTimeout(() => setHeartBurst(prev => ({ ...prev, [postId]: false })), 750);
    setTimeout(() => setLikeAnimating(prev => ({ ...prev, [postId]: false })), 400);
  };

  const handleLike = async (postId) => {
    if (!token || !currentUserId) return alert("Please log in to like posts!");
    triggerHeartBurst(postId);

    // If it's a mock post (fake ID), handle locally without API
    const isMockPost = postId.startsWith('mp');
    if (isMockPost) {
      const currentMocks = localMockPosts || mockPosts;
      setLocalMockPosts(currentMocks.map(p => {
        if (p._id !== postId) return p;
        const alreadyLiked = p.likes.includes(currentUserId);
        return { ...p, likes: alreadyLiked ? p.likes.filter(id => id !== currentUserId) : [...p.likes, currentUserId] };
      }));
      return;
    }

    // Real DB post — call the API
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
      } else {
        const err = await res.json();
        console.error("Like failed:", err.error);
      }
    } catch (err) { console.error(err); }
  };

  const handleComment = async (postId) => {
    if (!token || !currentUserId) return alert("Please log in to comment!");
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    // If it's a mock post, handle locally
    const isMockPost = postId.startsWith('mp');
    if (isMockPost) {
      const currentMocks = localMockPosts || mockPosts;
      setLocalMockPosts(currentMocks.map(p => {
        if (p._id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, { userId: { username: currentUsername || 'You' }, text }]
        };
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      return;
    }

    // Real DB post — call the API
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, comments: data.comments } : p));
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      } else {
        const err = await res.json();
        console.error("Comment failed:", err.error);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    if (postId.toString().startsWith('mp')) {
      const currentMocks = localMockPosts || mockPosts;
      setLocalMockPosts(currentMocks.filter(p => p._id !== postId));
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadPost = async () => {
    if (!token) return alert("Please log in to post.");
    if (!uploadFile) return alert("Please select an image file.");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        setUploading(false);
        return alert("Failed to upload image file.");
      }

      const uploadData = await uploadRes.json();

      // Set the image of the tagged hotspot item to the post image itself
      const finalHotspots = uploadHotspots.map(hs => ({
        ...hs,
        imageUrl: uploadData.imageUrl
      }));

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          influencerId: currentUserId,
          imageUrl: uploadData.imageUrl,
          description: uploadDesc,
          hotspots: finalHotspots
        })
      });
      if (res.ok) {
        setShowUploadModal(false);
        setUploadFile(null);
        setPreviewUrl("");
        setUploadDesc("");
        setUploadHotspots([]);
        setShowTagForm(null);
        fetchPosts(); // Refresh the feed
      } else {
        alert("Failed to create post.");
      }
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  return (
    <div className="h-full animate-fade-in max-w-lg mx-auto">
      {/* HEADER */}
      <div className="mb-4 text-center relative">
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-0.5">
          The Feed
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Get inspired by influencers and community styling.
        </p>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md"
        >
          📸 Upload Yours
        </button>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-extrabold text-black mb-6">Share to Community</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Image *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploadFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                      setUploadHotspots([]);
                      setShowTagForm(null);
                    }
                  }} 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200" 
                />
                
                {previewUrl && (
                  <div className="space-y-4 mt-4">
                    <p className="text-[11px] font-bold text-gray-500 bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-200 text-left">
                      💡 Click anywhere on the image preview below to place a shopping hotspot!
                    </p>
                    <div className="relative border border-gray-200 rounded-2xl overflow-hidden cursor-crosshair w-full max-h-60 flex justify-center bg-gray-50">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-60 object-contain w-full select-none"
                        onClick={handleImageClick}
                      />
                      
                      {/* Render existing tags */}
                      {uploadHotspots.map((hs, idx) => (
                        <div 
                          key={idx}
                          className="absolute w-5 h-5 rounded-full bg-yellow-300 border border-black shadow-md flex items-center justify-center text-[10px] font-black text-black select-none"
                          style={{ left: `${hs.x}%`, top: `${hs.y}%`, transform: 'translate(-50%, -50%)', zIndex: 15 }}
                          title={`${hs.name} ($${hs.price})`}
                        >
                          {idx + 1}
                        </div>
                      ))}
                      
                      {/* Render current temporary pin */}
                      {showTagForm && (
                        <div 
                          className="absolute w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-md animate-pulse"
                          style={{ left: `${showTagForm.x}%`, top: `${showTagForm.y}%`, transform: 'translate(-50%, -50%)', zIndex: 20 }}
                        />
                      )}
                    </div>
                    
                    {/* Add tag form */}
                    {showTagForm && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3 relative animate-fade-in text-left">
                        <button 
                          onClick={() => setShowTagForm(null)}
                          className="absolute top-3 right-4 text-xs font-bold text-gray-400 hover:text-black"
                        >
                          Cancel
                        </button>
                        <h4 className="text-xs font-bold text-gray-800">Tag item at ({showTagForm.x}%, {showTagForm.y}%)</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            placeholder="Product Name *" 
                            value={tagFormName}
                            onChange={e => setTagFormName(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black font-semibold"
                          />
                          <input 
                            type="number" 
                            placeholder="Price ($) *" 
                            value={tagFormPrice}
                            onChange={e => setTagFormPrice(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black font-semibold"
                          />
                        </div>
                        
                        <input 
                          type="text" 
                          placeholder="Buy Link (e.g. Myntra/Zara URL)" 
                          value={tagFormLink}
                          onChange={e => setTagFormLink(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black font-semibold"
                        />
                        
                        <button
                          type="button"
                          onClick={addHotspotTag}
                          disabled={!tagFormName.trim() || !tagFormPrice}
                          className="w-full bg-black text-white hover:bg-yellow-400 hover:text-black py-2 rounded-xl text-xs font-bold transition disabled:opacity-50"
                        >
                          Save Hotspot Tag ✦
                        </button>
                      </div>
                    )}

                    {/* Tag list */}
                    {uploadHotspots.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-gray-100 text-left">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tagged Items</span>
                        <div className="flex flex-wrap gap-2">
                          {uploadHotspots.map((hs, idx) => (
                            <div key={idx} className="bg-gray-100 border border-gray-200 pl-3 pr-2 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-2 shadow-sm">
                              <span>#{idx+1} {hs.name} (${hs.price})</span>
                              <button 
                                type="button"
                                onClick={() => setUploadHotspots(prev => prev.filter((_, i) => i !== idx))}
                                className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white flex items-center justify-center text-[9px] font-bold"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Caption</label>
                <textarea value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black min-h-[100px]" placeholder="Tell us about this look..."></textarea>
              </div>
              <button 
                onClick={handleUploadPost}
                disabled={uploading}
                className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : "Post to Feed 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (posts.length > 0 ? posts : mockPosts).length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <span className="text-4xl mb-3 block">📸</span>
          <h3 className="text-sm font-bold text-black dark:text-white">No Posts Yet</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1 text-xs">Be the first to share a look!</p>
        </div>
      ) : (
        <div className="space-y-5 pb-10">
          {(posts.length > 0 ? posts : (localMockPosts || mockPosts)).map((post) => (
            <div key={post._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col group">
              
              {/* FEED ITEM HEADER */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {post.influencerId?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">@{post.influencerId?.username}</h4>
                      {post.influencerId?.role === 'influencer' && (
                        <span className="bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          👑 Spotlight
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Delete button */}
                {(post.influencerId?._id === currentUserId || 
                  post.influencerId === currentUserId || 
                  (post.influencerId?.username === currentUsername && post._id.toString().startsWith('mp'))) && (
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    className="text-[9px] bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 px-2 py-1 rounded-full font-bold transition-all"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* POST IMAGE */}
              <div 
                className="w-full bg-gray-50 dark:bg-zinc-950 flex items-center justify-center relative cursor-pointer"
                onDoubleClick={() => handleLike(post._id)}
              >
                <img 
                  src={post.imageUrl} 
                  alt="Post" 
                  className="w-full h-auto max-h-[300px] object-cover"
                  onError={e => { e.target.onerror=null; e.target.style.minHeight='200px'; e.target.style.background='#f9f9f9'; }}
                />

                {/* Hotspot Overlays */}
                {getHotspotsForPost(post).map((hotspot, hIdx) => {
                  const isOpen = activeHotspot && activeHotspot.postId === post._id && activeHotspot.index === hIdx;
                  
                  return (
                    <div 
                      key={hIdx}
                      className="absolute"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, zIndex: isOpen ? 40 : 10 }}
                      onClick={(e) => e.stopPropagation()} // Prevent double-tap / click likes on hotspots
                      onDoubleClick={(e) => e.stopPropagation()}
                    >
                      {/* Pulse dot pin */}
                      <div 
                        className="hotspot-pin"
                        onClick={() => {
                          setActiveHotspot(isOpen ? null : { postId: post._id, index: hIdx });
                        }}
                      />
                      
                      {/* Tooltip Hover Card */}
                      {isOpen && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md border border-gray-200/80 p-3 rounded-2xl shadow-xl animate-fade-in text-left text-black flex flex-col gap-2.5">
                          {/* Close button */}
                          <button 
                            onClick={() => setActiveHotspot(null)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 text-gray-700 font-bold text-[9px] flex items-center justify-center border border-white hover:bg-gray-300 shadow-sm"
                          >
                            ✕
                          </button>
                          
                          {/* Garment details */}
                          <div className="flex gap-2 items-center">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                              <img src={hotspot.imageUrl} alt={hotspot.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="leading-tight overflow-hidden">
                              <h5 className="font-extrabold text-xs text-gray-900 truncate">{hotspot.name}</h5>
                              <span className="text-[10px] font-black text-yellow-600 block mt-0.5">${hotspot.price}</span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-1.5 mt-0.5">
                            <button
                              onClick={() => {
                                setSelectedOutfit({ name: hotspot.name, image: hotspot.imageUrl });
                                setFromShop(true);
                                setPage("AI Try-On");
                              }}
                              className="flex-1 py-1.5 bg-black text-white hover:bg-yellow-400 hover:text-black rounded-lg text-[10px] font-extrabold transition-all text-center"
                            >
                              ✨ Try On
                            </button>
                            <a
                              href={hotspot.buyLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-1.5 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg text-[10px] font-extrabold transition-all text-center flex items-center justify-center"
                            >
                              💳 Buy
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {heartBurst[post._id] && (
                  <span className="heart-burst-overlay select-none">❤️</span>
                )}
              </div>

              {/* POST FOOTER */}
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-3 mb-2">
                  <button 
                    onClick={() => handleLike(post._id)} 
                    className={`flex items-center gap-1 transition-transform focus:outline-none ${likeAnimating[post._id] ? 'like-btn-pop' : ''}`}
                  >
                    <span className="text-base leading-none" style={{ filter: (post.likes||[]).includes(currentUserId) ? 'drop-shadow(0 0 4px #f43f5e)' : 'none' }}>
                      {(post.likes || []).includes(currentUserId) ? "❤️" : "🤍"}
                    </span>
                    <span className={`text-xs font-bold transition-colors ${(post.likes||[]).includes(currentUserId) ? 'text-rose-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      {(post.likes || []).length}
                    </span>
                  </button>
                  <button onClick={() => document.getElementById(`comment-${post._id}`).focus()} className="flex items-center gap-1 hover:scale-110 transition-transform">
                    <span className="text-base">💬</span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{(post.comments || []).length}</span>
                  </button>
                  <button className="text-base hover:scale-110 transition-transform">🚀</button>
                </div>
                {post.description && (
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    <span className="font-bold mr-1">@{post.influencerId?.username}</span>
                    {post.description}
                  </p>
                )}
                
                {/* Comments */}
                <div className="mb-2 space-y-1">
                  {(post.comments || []).map((c, idx) => (
                    <p key={idx} className="text-[10px] text-gray-700 dark:text-gray-300">
                      <span className="font-bold mr-1">@{c.userId?.username || "user"}</span>
                      {c.text}
                    </p>
                  ))}
                </div>
                
                <div className="flex gap-2 mb-2">
                  <input 
                    id={`comment-${post._id}`}
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                    className="flex-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-full px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#FBBF24] outline-none dark:text-gray-200"
                  />
                  <button 
                    onClick={() => handleComment(post._id)}
                    disabled={!commentInputs[post._id]?.trim()}
                    className="font-bold text-xs text-blue-500 disabled:opacity-50 hover:text-blue-700"
                  >
                    Post
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedOutfit({ image: post.imageUrl, name: `Inspired by @${post.influencerId?.username}` });
                    setFromShop(false);
                    setPage("AI Try-On");
                  }}
                  className="w-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  ✨ Try This Look
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// src/pages/AITryOn.jsx
import { useRef, useState, useEffect } from "react"
import StudioSwitch from "../components/StudioSwitch"
import WebcamCapture from "../components/WebcamCapture"
import AIDemoModal from "../components/AIDemoModal"

export default function AITryOn({ page, setPage, selectedOutfit, fromShop }) {
  const sectionRef = useRef(null)

  const [userPhoto, setUserPhoto] = useState(null)
  const [outfitPhoto, setOutfitPhoto] = useState(null)

  const [userFile, setUserFile] = useState(null)
  const [outfitFile, setOutfitFile] = useState(null)

  const [generatedPreview, setGeneratedPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  // Interactive Simulation Fallback States
  const [useInteractiveFallback, setUseInteractiveFallback] = useState(false)
  const [garmentPos, setGarmentPos] = useState({ x: 0, y: -20 })
  const [garmentSize, setGarmentSize] = useState(55)
  const [garmentTrimTop, setGarmentTrimTop] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showCamera, setShowCamera] = useState(false)

  // Multi-step Loading Experience State
  const [loadingStep, setLoadingStep] = useState(0)

  // Try-on category state (defaults to upper_body)
  const [tryOnCategory, setTryOnCategory] = useState("upper_body")

  useEffect(() => {
    let interval
    if (loading) {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev))
      }, 2500)
    }
    return () => clearInterval(interval)
  }, [loading])

  const loadingMessages = [
    "Uploading photos to Dressing Room...",
    "Detecting body proportions and pose...",
    "Stitching garment textures and folds...",
    "Performing final style lighting adjustments..."
  ]

  useEffect(() => {
    if (fromShop && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [fromShop])

  // If redirected from Shop or Feed with a pre-selected outfit, populate it
  useEffect(() => {
    if (selectedOutfit && selectedOutfit.image) {
      setOutfitPhoto(selectedOutfit.image)
      setOutfitFile(null)

      // Auto-detect category
      const desc = (selectedOutfit.name || "").toLowerCase()
      if (desc.includes("dress") || desc.includes("ethnic") || desc.includes("kurta") || desc.includes("gown") || desc.includes("saree") || desc.includes("suit")) {
        setTryOnCategory("dresses")
      } else if (desc.includes("pant") || desc.includes("jeans") || desc.includes("trouser") || desc.includes("skirt") || desc.includes("shorts")) {
        setTryOnCategory("lower_body")
      } else {
        setTryOnCategory("upper_body")
      }
    }
  }, [selectedOutfit])

  const generateTryOn = async () => {
    if (!userFile || (!outfitFile && !outfitPhoto)) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("user", userFile);

    if (outfitFile) {
      formData.append("outfit", outfitFile);
    } else if (outfitPhoto) {
      formData.append("outfitUrl", outfitPhoto);
    }

    const description = selectedOutfit?.name || "outfit";
    formData.append("category", tryOnCategory);
    formData.append("description", description);

    try {
      const res = await fetch("http://localhost:5000/api/tryon", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Try-on failed")
      }

      const data = await res.json();
      setGeneratedPreview(data.image);
      setUseInteractiveFallback(false);
    } catch (err) {
      alert(`Try-On Error: ${err.message}\n\nSwitching to the Interactive Fitting Room fallback so you can try on the garment manually!`);
      setUseInteractiveFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setGeneratedPreview(null)
    setUserFile(null)
    setOutfitFile(null)
    setUserPhoto(null)
    setOutfitPhoto(null)
    setUseInteractiveFallback(false)
    setGarmentPos({ x: 0, y: -20 })
    setGarmentSize(55)
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = generatedPreview || outfitPhoto
    link.download = useInteractiveFallback ? "Interactive-Fitting-Room.png" : "AI-TryOn-Result.png"
    link.click()
  }

  return (
    <section ref={sectionRef} className="h-full relative overflow-y-auto w-full custom-scrollbar animate-fade-in pb-12">
      {showCamera && (
        <WebcamCapture 
          onCancel={() => setShowCamera(false)}
          onCapture={(dataUrl, file) => {
            setUserPhoto(dataUrl)
            setUserFile(file)
            setShowCamera(false)
          }}
        />
      )}
      {/* Custom styles for scanner line */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.2; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.2; }
        }
        .scan-line {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* SWITCH BUTTONS */}
      <div className="max-w-6xl mx-auto mb-8">
        <StudioSwitch page={page} setPage={setPage} />
      </div>

      {/* MAIN CARD: Sleek Glassmorphism */}
      <div className="backdrop-blur-md bg-white/80 border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 max-w-5xl mx-auto transition-all duration-300">
        <div className="flex justify-between items-start border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black mb-1.5">AI Virtual Fitting Room</h2>
            <p className="text-sm text-gray-500 font-medium">
              Upload your photo and target outfit. Our AI will seamlessly dress you in it.
            </p>
          </div>

          {(generatedPreview || useInteractiveFallback) && (
            <button
              onClick={resetAll}
              className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-all active:scale-90"
              title="Reset workspace"
            >
              ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          
          {/* LEFT COLUMN: Input Dropzones */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Upload Files</h3>

            {/* USER PHOTO DROPZONE */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="text-base">👤</span> Your full-body photo
                </p>
                <button 
                  onClick={() => setShowCamera(true)}
                  className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                >
                  Take Photo 📸
                </button>
              </div>
              <label className="group relative border-2 border-dashed border-gray-200 hover:border-black/30 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50/50 hover:bg-gray-50 min-h-[160px] overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setUserPhoto(URL.createObjectURL(file))
                      setUserFile(file)
                    }
                  }}
                  className="hidden"
                />
                {userPhoto ? (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white group-hover:opacity-90 transition-opacity">
                    <img src={userPhoto} alt="you" className="w-full h-full object-contain p-1" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-xs font-semibold">
                      Change Photo 📷
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 text-center">
                    <div className="text-3xl group-hover:scale-110 transition-transform">📸</div>
                    <span className="text-xs font-semibold text-gray-500">Click to upload body photo</span>
                    <span className="text-[10px] text-gray-400">JPEG, PNG, AVIF up to 50MB</span>
                  </div>
                )}
              </label>
            </div>

            {/* OUTFIT PHOTO DROPZONE */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <span className="text-base">👗</span> Target outfit photo
              </p>
              <label className="group relative border-2 border-dashed border-gray-200 hover:border-black/30 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50/50 hover:bg-gray-50 min-h-[160px] overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setOutfitPhoto(URL.createObjectURL(file))
                      setOutfitFile(file)
                    }
                  }}
                  className="hidden"
                />
                {outfitPhoto ? (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white group-hover:opacity-90 transition-opacity">
                    <img src={outfitPhoto} alt="outfit" className="w-full h-full object-contain p-1" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-xs font-semibold">
                      Change Photo 📷
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 text-center">
                    <div className="text-3xl group-hover:scale-110 transition-transform">👕</div>
                    <span className="text-xs font-semibold text-gray-500">Click to upload outfit photo</span>
                    <span className="text-[10px] text-gray-400">JPEG, PNG, AVIF up to 50MB</span>
                  </div>
                )}
              </label>
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <span>🏷️</span> Garment Category
              </label>
              <select
                value={tryOnCategory}
                onChange={(e) => setTryOnCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 font-semibold text-sm focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "16px"
                }}
              >
                <option value="upper_body">👕 Top (Shirts, T-shirts, Jackets)</option>
                <option value="lower_body">👖 Bottom (Pants, Jeans, Skirts)</option>
                <option value="dresses">👗 Full Body (Suits, Dresses, Kurta Gowns)</option>
              </select>
            </div>

            <button
              onClick={generateTryOn}
              disabled={!userFile || (!outfitFile && !outfitPhoto) || loading}
              className="mt-4 w-full bg-black text-white hover:bg-neutral-800 py-3.5 rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-lg">⏳</span>
                  <span>Generating Try-On...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate Try-On</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Results & Fallbacks */}
          <div className="flex flex-col border border-gray-100 rounded-3xl p-6 bg-gray-50/30 text-center relative justify-between min-h-[420px]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 self-start">Workspace Preview</h3>

            {/* SCANNING LOADER STATE */}
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[320px] relative w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex-1">
                {/* Laser Scanning Line */}
                <div className="absolute inset-x-0 h-[2px] bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.8)] scan-line pointer-events-none" />

                {/* Animated Pulsing Hanger */}
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 relative animate-pulse shadow-inner">
                  <span className="text-4xl animate-bounce">👗</span>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40 animate-[spin_8s_linear_infinite]" />
                </div>

                <h4 className="font-bold text-black mb-1.5 text-base">Fitting Your Outfit</h4>
                <p className="text-xs text-amber-600 font-semibold tracking-wide uppercase transition-all duration-300">
                  {loadingMessages[loadingStep]}
                </p>

                {/* Steps Indicator Dot Matrix */}
                <div className="flex gap-2 mt-5">
                  {loadingMessages.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === loadingStep ? "bg-amber-500 scale-125 shadow-sm" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : useInteractiveFallback && userPhoto && outfitPhoto ? (
              /* INTERACTIVE FITTING ROOM WORKSPACE */
              <div className="flex flex-col flex-1">
                <div 
                  className="relative w-full h-[320px] overflow-hidden flex items-center justify-center select-none bg-white rounded-2xl border border-gray-100 shadow-sm"
                  style={{ touchAction: 'none' }}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full shadow-md">
                    Manual Fitting Mode
                  </div>

                  {/* Body Image */}
                  <img src={userPhoto} alt="user" className="absolute w-full h-full object-contain pointer-events-none p-2" />

                  {/* Draggable Clothing Overlay */}
                  <img 
                    src={outfitPhoto} 
                    alt="outfit overlay" 
                    style={{
                      position: 'absolute',
                      width: `${garmentSize}%`,
                      left: `calc(50% + ${garmentPos.x}px)`,
                      top: `calc(50% + ${garmentPos.y}px)`,
                      transform: 'translate(-50%, -50%)',
                      clipPath: `inset(${garmentTrimTop}% 0 0 0)`,
                      cursor: isDragging ? 'grabbing' : 'grab',
                      userSelect: 'none',
                      touchAction: 'none'
                    }}
                    onMouseDown={(e) => {
                      setIsDragging(true)
                      setDragStart({ x: e.clientX - garmentPos.x, y: e.clientY - garmentPos.y })
                    }}
                    onMouseMove={(e) => {
                      if (!isDragging) return
                      setGarmentPos({
                        x: e.clientX - dragStart.x,
                        y: e.clientY - dragStart.y
                      })
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onTouchStart={(e) => {
                      setIsDragging(true)
                      const touch = e.touches[0]
                      setDragStart({ x: touch.clientX - garmentPos.x, y: touch.clientY - garmentPos.y })
                    }}
                    onTouchMove={(e) => {
                      if (!isDragging) return
                      const touch = e.touches[0]
                      setGarmentPos({
                        x: touch.clientX - dragStart.x,
                        y: touch.clientY - dragStart.y
                      })
                    }}
                    onTouchEnd={() => setIsDragging(false)}
                    className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                  />
                </div>

                {/* Slider controls for Interactive Fallback */}
                <div className="mt-4 px-4 py-3 bg-white rounded-2xl border border-gray-100 flex flex-col gap-2 shadow-sm text-left">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>📐 Drag garment or adjust size:</span>
                    <span className="text-black font-semibold">{garmentSize}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="150" 
                    value={garmentSize} 
                    onChange={(e) => setGarmentSize(Number(e.target.value))}
                    className="w-full h-1 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 mt-2">
                    <span>✂️ Trim Face/Neck:</span>
                    <span className="text-black font-semibold">{garmentTrimTop}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={garmentTrimTop} 
                    onChange={(e) => setGarmentTrimTop(Number(e.target.value))}
                    className="w-full h-1 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-black"
                  />

                  <button 
                    onClick={() => {
                      setGarmentPos({ x: 0, y: -20 })
                      setGarmentSize(55)
                      setGarmentTrimTop(0)
                    }}
                    className="text-[10px] text-gray-400 hover:text-black font-black uppercase tracking-wider mt-1 self-end transition-colors"
                  >
                    Reset Position 🔄
                  </button>
                </div>
              </div>
            ) : generatedPreview ? (
              /* RESULT VIEW */
              <div className="bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm flex-1 p-2">
                <img src={generatedPreview} alt="result" className="w-full h-auto max-h-[300px] object-contain rounded-xl" />
              </div>
            ) : (
              /* EMPTY DEFAULT STATE */
              <div className="bg-white rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 border border-gray-100 shadow-inner flex-1 min-h-[280px]">
                <span className="text-5xl mb-3 animate-[pulse_2s_infinite]">👚</span>
                <h4 className="text-black font-bold text-sm mb-1">No Outfit Generated Yet</h4>
                <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed font-medium">
                  Upload your photos on the left and tap generate to see your virtual styling result.
                </p>
              </div>
            )}

            {(generatedPreview || useInteractiveFallback) && !loading && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>⬇️</span> Download
                </button>
                <button
                  onClick={async () => {
                    const imgUrl = generatedPreview || outfitPhoto;
                    if (navigator.share) {
                      try {
                        const blob = await fetch(imgUrl).then(r => r.blob());
                        const file = new File([blob], 'style-snap-result.png', { type: blob.type });
                        await navigator.share({
                          title: 'My StyleSnap Outfit!',
                          text: 'Check out my new AI-styled outfit generated by StyleSnap+ 🔥',
                          files: [file]
                        });
                      } catch (err) {
                        console.log("Share cancelled or failed", err);
                      }
                    } else {
                      try {
                        const blob = await fetch(imgUrl).then(r => r.blob());
                        await navigator.clipboard.write([
                          new ClipboardItem({ [blob.type]: blob })
                        ]);
                        alert("Image copied to clipboard!");
                      } catch (err) {
                        alert("Your browser does not support Web Share or Clipboard copying. Please use the Download button.");
                      }
                    }
                  }}
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>🚀</span> Share
                </button>
              </div>
            )}
            
            {(generatedPreview || useInteractiveFallback) && !loading && (
              <button
                onClick={async () => {
                  const userId = localStorage.getItem("stylesnap_userid");
                  if (!userId) {
                    alert("Please log in to your Wardrobe first!");
                    setPage("Wardrobe");
                    return;
                  }
                  try {
                    const res = await fetch("http://localhost:5000/api/wardrobe", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId,
                        imageUrl: generatedPreview || outfitPhoto,
                        type: useInteractiveFallback ? "outfit" : "result"
                      })
                    });
                    if (res.ok) alert("✅ Saved to your Cloud Wardrobe!");
                    else alert("❌ Failed to save.");
                  } catch (err) {
                    console.error(err);
                    alert("❌ Could not connect to database.");
                  }
                }}
                className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>💾</span> Save to Wardrobe
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

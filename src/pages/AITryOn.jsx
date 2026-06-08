// src/pages/AITryOn.jsx
import { useRef, useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
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
      const res = await fetch("/api/tryon", {
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

  const sampleOutfits = [
    { name: "Casual Linen", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150" },
    { name: "Denim & Knit", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=150" },
    { name: "Warm Trench", image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=150" },
    { name: "Vibrant Jacket", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150" },
    { name: "Summer Dress", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150" },
    { name: "Luxe Outfit", image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=150" }
  ]

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
      <div className="max-w-3xl mx-auto mb-4">
        <StudioSwitch page={page} setPage={setPage} />
      </div>

      {/* 3-STEP PROGRESS INDICATOR */}
      <div className="max-w-3xl mx-auto mb-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 shadow-sm transition-colors">
        <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
          <span className="w-5 h-5 rounded-full bg-[#FBBF24] text-[#1C1C1C] flex items-center justify-center font-black">1</span>
          <span>Upload yourself</span>
        </div>
        <span className="text-gray-300 dark:text-gray-700">→</span>
        <div className={`flex items-center gap-1.5 ${userFile ? "text-gray-800 dark:text-gray-200" : ""}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black ${userFile ? "bg-[#FBBF24] text-[#1C1C1C]" : "bg-gray-150 dark:bg-zinc-800 text-gray-500"}`}>2</span>
          <span>Pick an outfit</span>
        </div>
        <span className="text-gray-300 dark:text-gray-700">→</span>
        <div className={`flex items-center gap-1.5 ${(userFile && (outfitFile || outfitPhoto)) ? "text-gray-800 dark:text-gray-200" : ""}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black ${(userFile && (outfitFile || outfitPhoto)) ? "bg-[#FBBF24] text-[#1C1C1C]" : "bg-gray-150 dark:bg-zinc-800 text-gray-500"}`}>3</span>
          <span>Generate look</span>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-zinc-900/60 border border-gray-150 dark:border-zinc-800 rounded-2xl p-4 md:p-5 max-w-3xl mx-auto transition-colors duration-200 shadow-sm">
        <div className="flex justify-between items-start border-b border-gray-150 dark:border-zinc-800 pb-3">
          <div className="text-left">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-0.5">AI Virtual Fitting Room</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Upload your photo and target outfit. Our AI will dress you in it virtually.
            </p>
          </div>

          {(generatedPreview || useInteractiveFallback) && (
            <button
              onClick={resetAll}
              className="w-7 h-7 rounded-full bg-gray-50 dark:bg-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all active:scale-90"
              title="Reset workspace"
            >
              ✕
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          
          {/* LEFT COLUMN: Input Dropzones */}
          <div className="flex flex-col gap-3 text-left">
            
            {/* SIDE-BY-SIDE SIDE CARD UPLOAD ZONES (NO BOX INSIDE A BOX, VISIBLE AT SAME TIME) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Step 1 Card (Dropzone) */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Step 1 — You ✨</span>
                  <button 
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="text-[8px] font-black text-gray-500 hover:text-black dark:hover:text-white uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 hover:bg-gray-250 dark:hover:bg-zinc-700 px-2 py-0.5 rounded transition-colors"
                  >
                    Camera 📸
                  </button>
                </div>
                <label 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath d='M12 2a1 1 0 0 0-1 1c0 .26.14.5.34.66L4.94 6.8c-.3.26-.5.64-.5 1.06 0 .83.67 1.5 1.5 1.5h12.12c.83 0 1.5-.67 1.5-1.5 0-.42-.2-.8-.5-1.06L16.6 4.66c.2-.16.34-.4.34-.66a1 1 0 0 0-1-1zm-4 5v2.5' fill='none' stroke='%23000000' stroke-opacity='0.04' stroke-width='1.2'/%3E%3C/svg%3E")`
                  }}
                  className="aspect-[3/4] bg-gray-50 dark:bg-zinc-950 border-2 border-dashed border-gray-250 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#FBBF24] dark:hover:border-[#FBBF24] hover:bg-[#FFFBEB] dark:hover:bg-yellow-950/5 transition-all p-2 shadow-sm"
                >
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
                    <img src={userPhoto} alt="you" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center p-2 text-gray-400 dark:text-gray-500">
                      <span className="text-2xl">👤</span>
                      <span className="text-[10px] font-bold leading-tight">Upload Yourself</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Step 2 Card (Dropzone) */}
              <div className="flex flex-col">
                <div className="mb-1.5 text-left">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Step 2 — Outfit 👗</span>
                </div>
                <label 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath d='M12 2a1 1 0 0 0-1 1c0 .26.14.5.34.66L4.94 6.8c-.3.26-.5.64-.5 1.06 0 .83.67 1.5 1.5 1.5h12.12c.83 0 1.5-.67 1.5-1.5 0-.42-.2-.8-.5-1.06L16.6 4.66c.2-.16.34-.4.34-.66a1 1 0 0 0-1-1zm-4 5v2.5' fill='none' stroke='%23000000' stroke-opacity='0.04' stroke-width='1.2'/%3E%3C/svg%3E")`
                  }}
                  className="aspect-[3/4] bg-gray-50 dark:bg-zinc-950 border-2 border-dashed border-gray-250 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#FBBF24] dark:hover:border-[#FBBF24] hover:bg-[#FFFBEB] dark:hover:bg-yellow-950/5 transition-all p-2 shadow-sm"
                >
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
                    <img src={outfitPhoto} alt="outfit" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center p-2 text-gray-400 dark:text-gray-500">
                      <span className="text-2xl">👗</span>
                      <span className="text-[10px] font-bold leading-tight">Upload Outfit</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* SAMPLE OUTFIT GALLERY */}
            <div className="mt-2 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Or choose a sample outfit:</h4>
              <div className="grid grid-cols-6 gap-2">
                {sampleOutfits.map((outfit, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setOutfitPhoto(outfit.image);
                      setOutfitFile(null);
                    }}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-[#FBBF24] transition-all hover:scale-105 active:scale-95 shadow-sm animate-fade-in"
                    title={outfit.name}
                  >
                    <img src={outfit.image} alt={outfit.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Garment Category
              </label>
              <select
                value={tryOnCategory}
                onChange={(e) => setTryOnCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FBBF24] transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "14px"
                }}
              >
                <option value="upper_body">👕 Top (Shirts, Jackets)</option>
                <option value="lower_body">👖 Bottom (Pants, Skirts)</option>
                <option value="dresses">👗 Full Body (Dresses, Suits)</option>
              </select>
            </div>

            {/* ACTION BUTTON (BRAND YELLOW PILL) */}
            <button
              onClick={generateTryOn}
              disabled={!userFile || (!outfitFile && !outfitPhoto) || loading}
              className="mt-4 w-full bg-[#FBBF24] text-[#1C1C1C] hover:bg-yellow-500 py-3.5 rounded-full font-black uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-97 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Dressing up...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate My Look</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Results & Fallbacks */}
          <div className="flex flex-col border border-gray-150 dark:border-zinc-800 rounded-3xl p-6 bg-gray-50/20 dark:bg-zinc-900/10 text-center relative justify-between min-h-[420px]">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 self-start">Workspace Preview</h3>

            {/* SCANNING LOADER STATE (SHIMMER + SCANNER) */}
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[320px] relative w-full bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex-1 animate-pulse">
                {/* Laser Scanning Line */}
                <div className="absolute inset-x-0 h-[2px] bg-amber-500/85 shadow-[0_0_8px_rgba(245,158,11,0.8)] scan-line pointer-events-none" />

                {/* Animated Pulsing Icon */}
                <div className="w-20 h-20 rounded-full bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center mb-6 relative shadow-inner">
                  <span className="text-4xl animate-bounce">👗</span>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FBBF24]/60 animate-[spin_8s_linear_infinite]" />
                </div>

                <h4 className="font-black text-gray-800 dark:text-white mb-1.5 text-base">Fitting Your Outfit</h4>
                <p className="text-xs text-amber-500 dark:text-amber-400 font-bold tracking-wide uppercase transition-all duration-350">
                  {loadingMessages[loadingStep]}
                </p>

                {/* Steps Indicator Dot Matrix */}
                <div className="flex gap-2 mt-5">
                  {loadingMessages.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === loadingStep ? "bg-[#FBBF24] scale-125 shadow-sm" : "bg-gray-200 dark:bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : useInteractiveFallback && userPhoto && outfitPhoto ? (
              /* INTERACTIVE FITTING ROOM WORKSPACE */
              <div className="flex flex-col flex-1">
                <div 
                  className="relative w-full h-[320px] overflow-hidden flex items-center justify-center select-none bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm"
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
                <div className="mt-4 px-4 py-3 bg-white dark:bg-zinc-950 rounded-2xl border border-gray-150 dark:border-zinc-800 flex flex-col gap-2 shadow-sm text-left">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>📐 Drag garment or adjust size:</span>
                    <span className="text-black dark:text-white font-black">{garmentSize}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="150" 
                    value={garmentSize} 
                    onChange={(e) => setGarmentSize(Number(e.target.value))}
                    className="w-full h-1 bg-gray-150 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
                  />
                  
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 mt-2">
                    <span>✂️ Trim Face/Neck:</span>
                    <span className="text-black dark:text-white font-black">{garmentTrimTop}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={garmentTrimTop} 
                    onChange={(e) => setGarmentTrimTop(Number(e.target.value))}
                    className="w-full h-1 bg-gray-150 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
                  />

                  <button 
                    onClick={() => {
                      setGarmentPos({ x: 0, y: -20 })
                      setGarmentSize(55)
                      setGarmentTrimTop(0)
                    }}
                    className="text-[10px] text-gray-400 hover:text-black dark:hover:text-white font-black uppercase tracking-wider mt-1 self-end transition-colors"
                  >
                    Reset Position 🔄
                  </button>
                </div>
              </div>
            ) : generatedPreview ? (
              /* RESULT VIEW */
              <div className="bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm flex-1 p-2">
                <img src={generatedPreview} alt="result" className="w-full h-auto max-h-[300px] object-contain rounded-xl" />
              </div>
            ) : (
              /* ELEGANT MODEL SILHOUETTE WORKSPACE PLACEHOLDER */
              <div className="bg-white dark:bg-zinc-950/40 rounded-2xl flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 p-8 border border-gray-150 dark:border-zinc-800 shadow-inner flex-1 min-h-[280px]">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300" 
                  alt="Fashion model silhouette" 
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full mb-4 border border-gray-200 dark:border-zinc-800 shadow-sm"
                />
                <h4 className="text-gray-800 dark:text-gray-200 font-black text-sm mb-1">Your Styled Look Will Appear Here</h4>
                <p className="text-[11px] text-gray-450 dark:text-gray-500 max-w-[200px] leading-relaxed font-semibold">
                  Select your photos on the left and tap the generate button below to dress your virtual model.
                </p>
              </div>
            )}

            {(generatedPreview || useInteractiveFallback) && !loading && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-[#FBBF24] hover:bg-yellow-500 text-black py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
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
                  className="flex-1 bg-black text-white dark:bg-zinc-800 hover:bg-neutral-800 dark:hover:bg-zinc-700 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
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
                    const res = await fetch("/api/wardrobe", {
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
                className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
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

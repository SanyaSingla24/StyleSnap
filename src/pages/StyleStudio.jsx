import { useState } from "react"
import UploadHero from "../components/UploadHero"
import HowItWorks from "../components/HowItWorks"
import AIDemoModal from "../components/AIDemoModal"
import StudioSwitch from "../components/StudioSwitch"

export default function StyleStudio({ page, setPage }) {
  const [showDemo, setShowDemo] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [outfitImage, setOutfitImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (file) => {
    setIsLoading(true)
    setOutfitImage(URL.createObjectURL(file))
    setAnalysisData(null)

    const formData = new FormData()
    formData.append("outfit", file)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Analysis request failed")
      }

      const data = await res.json()
      setAnalysisData(data)
      setShowDemo(true)
    } catch (err) {
      alert(`Style Analysis failed: ${err.message}`)
      console.error(err)
      setOutfitImage(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setShowDemo(false)
    setAnalysisData(null)
    setOutfitImage(null)
  }

  return (
    <>
      {/* 🔹 TOP SWITCH */}
      <div className="max-w-3xl mx-auto mb-4">
        <StudioSwitch page={page} setPage={setPage} />
      </div>

      {/* AI STYLING */}
      <UploadHero
        onDemo={() => {
          setAnalysisData(null)
          setOutfitImage(null)
          setShowDemo(true)
        }}
        onUpload={handleUpload}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-white text-xl font-bold">✨ AI is reviewing your outfit... 👗</p>
        </div>
      )}

      <HowItWorks />

      {/* RECENT LOOKS SECTION */}
      <div className="mt-8 text-left bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <h3 className="text-xs font-black text-gray-950 dark:text-white uppercase tracking-wider mb-4">
          Recent Looks
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* New Look Slot */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="aspect-[3/4] bg-gray-50 dark:bg-zinc-800/40 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-yellow-400 hover:text-yellow-500 transition-all duration-200 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center mb-1 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-950/20 transition-colors shadow-sm">
              <span className="text-base font-bold group-hover:scale-115 transition-transform text-gray-600 dark:text-gray-300">+</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Add Yours</span>
          </div>

          {/* Placeholder 1 */}
          <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-sm border border-gray-100 dark:border-zinc-800/80 group">
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200" 
              alt="Recent outfit" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2.5">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Boho Summer 🌸</span>
            </div>
          </div>

          {/* Placeholder 2 */}
          <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-sm border border-gray-100 dark:border-zinc-800/80 group">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200" 
              alt="Recent outfit" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2.5">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Chic Yellow 💛</span>
            </div>
          </div>

          {/* Placeholder 3 */}
          <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-sm border border-gray-100 dark:border-zinc-800/80 group">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200" 
              alt="Recent outfit" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2.5">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Street Spree 🏙️</span>
            </div>
          </div>
        </div>
      </div>

      {showDemo && (
        <AIDemoModal
          onClose={handleClose}
          data={analysisData}
          outfitImage={outfitImage}
        />
      )}
    </>
  )
}


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
      <StudioSwitch page={page} setPage={setPage} />

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


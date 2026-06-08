import { useRef, useState } from "react"
import { Sparkles } from "lucide-react"

export default function UploadHero({ onDemo, onUpload }) {
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="w-full text-center">

      {/* COMPACT BRAND BANNER STRIP WITH DECORATIVE IMAGE */}
      <div className="bg-[#FBBF24] text-[#1C1C1C] px-6 py-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-sm border border-yellow-500/20 text-left relative overflow-hidden">
        <div className="text-left z-10 flex-1">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-1.5 leading-none">
            Style Studio ✨
          </h2>
          <p className="text-xs text-[#1C1C1C]/85 font-bold mt-2 max-w-md sm:max-w-xl leading-relaxed">
            Upload an outfit photo. Our AI stylist will instantly reveal what works, what doesn't, and how to elevate your style.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onDemo}
              className="px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-full font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Try a Demo 🔮</span>
            </button>
          </div>
        </div>
        <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-black/10 shadow-sm hidden sm:block z-10">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300" 
            alt="Fashion flat-lay" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`max-w-2xl mx-auto rounded-2xl p-6 cursor-pointer border-2 border-dashed transition-all duration-200 group bg-white dark:bg-zinc-900/60 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${
          isDragOver 
            ? "border-[#FBBF24] bg-[#FFFBEB] dark:bg-yellow-950/5 border-solid" 
            : "border-gray-400 dark:border-zinc-700 hover:border-[#FBBF24] dark:hover:border-[#FBBF24] hover:bg-[#FFFBEB] dark:hover:bg-yellow-950/10 hover:border-solid"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* FASHION CAMERA ICON (NOT TRIANGLE) */}
        <div className="w-12 h-12 bg-[#FAFAF5] dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100 dark:border-zinc-700/80 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-[#FBBF24] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </div>

        {/* TEXT */}
        <h3 className="text-base font-black mb-1 text-gray-900 dark:text-white">
          Drag & drop your outfit photo here
        </h3>

        <p className="text-gray-400 dark:text-gray-500 mb-0.5 text-xs font-bold">
          or click to browse files
        </p>
      </div>

    </div>
  )
}

import { useRef } from "react"

export default function UploadHero({ onDemo, onUpload }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="bg-yellow-400 py-6 px-4 text-center">

      {/* TITLE */}
      <h1 className="text-3xl font-black mb-2">
        Style Studio
      </h1>

      {/* SUBTITLE */}
      <p className="text-sm text-gray-855 mb-4 max-w-xl mx-auto font-medium">
        Upload a photo of your outfit. Our AI stylist will reveal what works,
        what doesn’t, and how to elevate your look.
      </p>

      {/* UPLOAD CARD */}
      <div className="bg-white max-w-2xl mx-auto rounded-2xl p-6 shadow-xl">

        {/* ICON */}
        <div className="w-10 h-10 bg-black text-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-3 text-lg">
          ⬆️
        </div>

        {/* TEXT */}
        <h3 className="text-lg font-bold mb-0.5 text-gray-900">
          Drag & drop your outfit photo
        </h3>

        <p className="text-gray-555 mb-4 text-xs font-semibold">
          or use one of the options below
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:scale-105 transition"
          >
            Browse Files
          </button>

          <button
            onClick={onDemo}
            className="px-6 py-2.5 bg-yellow-400 rounded-xl font-semibold hover:bg-yellow-500 transition hover:scale-105"
          >
            ✨ Try a Demo
          </button>
        </div>
      </div>

    </div>
  )
}

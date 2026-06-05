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
    <div className="bg-yellow-400 py-8 px-6 text-center">

      {/* TITLE */}
      <h1 className="text-5xl font-extrabold mb-3">
        Style Studio
      </h1>

      {/* SUBTITLE */}
      <p className="text-base text-gray-800 mb-6 max-w-xl mx-auto">
        Upload a photo of your outfit. Our AI stylist will reveal what works,
        what doesn’t, and how to elevate your look.
      </p>

      {/* UPLOAD CARD */}
      <div className="bg-white max-w-3xl mx-auto rounded-3xl p-8 shadow-xl">

        {/* ICON */}
        <div className="w-12 h-12 bg-black text-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
          ⬆️
        </div>

        {/* TEXT */}
        <h3 className="text-xl font-bold mb-1">
          Drag & drop your outfit photo
        </h3>

        <p className="text-gray-500 mb-6 text-sm">
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

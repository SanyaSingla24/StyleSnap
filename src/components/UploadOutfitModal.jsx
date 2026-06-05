import { useState } from "react"

export default function UploadOutfitModal({ onClose, onPost }) {
  const [imageFile, setImageFile] = useState(null)
  const [captionText, setCaptionText] = useState("")

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[360px] relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-lg font-bold"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4">
          Share Your Outfit
        </h3>

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <textarea
          placeholder="Write a caption..."
          className="w-full border rounded-lg p-2 mb-6"
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
        />

        <button
          onClick={() => {
            if (!imageFile || !captionText) return
            onPost(imageFile, captionText)
          }}
          className="w-full bg-black text-white py-2 rounded-xl font-semibold"
        >
          Post Outfit
        </button>
      </div>
    </div>
  )
}

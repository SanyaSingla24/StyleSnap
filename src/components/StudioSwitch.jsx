export default function StudioSwitch({ page, setPage }) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => setPage("Style Studio")}
        className={`px-5 py-2 rounded-full font-medium transition ${
          page === "Style Studio"
            ? "bg-black text-white"
            : "border border-black hover:bg-black hover:text-white"
        }`}
      >
        Style Studio
      </button>

      <button
        onClick={() => setPage("AI Try-On")}
        className={`px-5 py-2 rounded-full font-medium transition ${
          page === "AI Try-On"
            ? "bg-black text-white"
            : "border border-black hover:bg-black hover:text-white"
        }`}
      >
        AI Try-On
      </button>
    </div>
  )
}

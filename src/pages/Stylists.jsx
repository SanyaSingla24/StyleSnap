export default function Stylists() {
  const stylists = [
    {
      name: "Priya Sharma",
      rating: "⭐⭐⭐⭐⭐",
      bio: "Ethnic & Wedding Stylist",
      image: "/priya_sharma.png"
    },
    {
      name: "Rohit Malhotra",
      rating: "⭐⭐⭐⭐☆",
      bio: "Casual & Streetwear Expert",
      image: "/rohit_malhotra.png"
    },
    {
      name: "Ananya Verma",
      rating: "⭐⭐⭐⭐⭐",
      bio: "Luxury & Party Wear Stylist",
      image: "/ananya_verma.png"
    }
  ]

  const recommendedStylist = "Ananya Verma"

  return (
    <div className="h-full animate-fade-in">
      {/* HEADER */}
      <div className="mb-4 text-left">
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-0.5">
          Expert Stylists
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Connect with professional fashion stylists to elevate your style
        </p>
      </div>

      {/* STYLISTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stylists.map((stylist, index) => {
          const isRecommended = stylist.name === recommendedStylist

          return (
          <div
            key={index}
            className={`bg-white dark:bg-zinc-900 rounded-2xl p-5 flex flex-col items-center text-center relative transition-all duration-300 ${
              isRecommended
                ? "border-2 border-[#FBBF24] shadow-md"
                : "border border-gray-150 dark:border-zinc-800 shadow-sm hover:shadow-md"
            }`}
          >
            {/* RECOMMENDED BADGE */}
            {isRecommended && (
              <div className="absolute -top-3 bg-black text-[#FBBF24] text-[9px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-md">
                ✨ Featured
              </div>
            )}

            {/* PROFILE IMAGE */}
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-gray-100 dark:border-zinc-700 shadow-sm">
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* NAME */}
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-0.5">
              {stylist.name}
            </h3>

            {/* RATING */}
            <div className="text-xs mb-2">
              {stylist.rating}
            </div>

            {/* BIO */}
            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-xs mb-4 flex-1 leading-relaxed">
              {stylist.bio}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 w-full mt-auto">
              <button
                onClick={() => alert(`Starting chat with ${stylist.name}...`)}
                className="flex-1 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-white active:scale-95 transition-all"
              >
                Chat
              </button>
              <button
                onClick={() => alert(`Booking session with ${stylist.name}...`)}
                className="flex-1 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:bg-[#FBBF24] hover:text-black active:scale-95 transition-all"
              >
                Book
              </button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}

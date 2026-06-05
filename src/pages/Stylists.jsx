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
    <div className="h-full px-6 py-4">
      {/* HEADER */}
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          Expert Designers
        </h1>
        <p className="text-sm text-gray-655 font-medium">
          Connect with professional fashion stylists to elevate your style quotient
        </p>
      </div>

      {/* STYLISTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stylists.map((stylist, index) => {
          const isRecommended = stylist.name === recommendedStylist

          return (
            <div
              key={index}
              className={`bg-white rounded-3xl p-8 flex flex-col items-center text-center relative transition-all duration-300 ${
                isRecommended
                  ? "border-2 border-black shadow-xl scale-[1.03]"
                  : "border border-gray-200 shadow-sm hover:shadow-lg"
              }`}
            >
              {/* RECOMMENDED BADGE */}
              {isRecommended && (
                <div className="absolute -top-3.5 bg-black text-yellow-300 text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-md">
                  ✨ Featured Stylist
                </div>
              )}

              {/* PROFILE IMAGE */}
              <div className="w-28 h-28 rounded-full overflow-hidden mb-6 border-4 border-gray-50 shadow-inner">
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* NAME */}
              <h3 className="font-extrabold text-xl text-gray-900 mb-1">
                {stylist.name}
              </h3>

              {/* RATING */}
              <div className="text-sm mb-3">
                {stylist.rating}
              </div>

              {/* BIO */}
              <p className="text-gray-500 text-sm max-w-xs mb-8 flex-1 leading-relaxed">
                {stylist.bio}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3 w-full mt-auto">
                <button
                  onClick={() => alert(`Starting chat with ${stylist.name}...`)}
                  className="flex-1 py-2.5 border border-black rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Chat
                </button>
                <button
                  onClick={() => alert(`Booking session with ${stylist.name}...`)}
                  className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-yellow-400 hover:text-black active:scale-95 transition-all"
                >
                  Book Session
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

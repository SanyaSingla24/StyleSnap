import React from "react"

export default function AboutUs() {
  const pillars = [
    {
      emoji: "🧬",
      title: "AI Style DNA",
      desc: "Our custom style profiling engine maps your aesthetic, silhouette, and color parameters to tailor matching recommendations in real-time."
    },
    {
      emoji: "🎭",
      title: "ZeroGPU Try-On",
      desc: "Integrating state-of-the-art virtual dressing pipelines (Leffa and IDM-VTON) to let you see outfits on your body with one click."
    },
    {
      emoji: "🛍️",
      title: "Creator Ecosystem",
      desc: "Empowering influencers and designers to tag shoppable hotspots directly on community posts, bridging social inspiration with checkouts."
    }
  ]

  const stats = [
    { value: "100%", label: "Free Virtual Dressing" },
    { value: "6+", label: "Whitelisted Fashion Spaces" },
    { value: "Instant", label: "Style DNA Profiling" }
  ]

  return (
    <div className="h-full px-6 py-4 animate-fade-in max-w-4xl mx-auto">
      {/* HERO SECTION */}
      <div className="mb-12 text-center">
        <span className="text-xs font-bold text-gray-500 bg-white/70 px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-200 shadow-sm">
          Our Vision
        </span>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mt-4 mb-3">
          StyleSnap+ Story
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Bridging advanced deep-learning vision pipelines with personal fashion self-expression.
        </p>
      </div>

      {/* THE VISION GRID */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl mb-10 text-left">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          Reimagining the Digital Wardrobe
        </h2>
        <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base font-medium">
          StyleSnap+ was born out of a simple question: *What if you could try on any item on the internet instantly, without leaving your house?* By replacing flat photo grids with interactive visual hotspots and localized virtual trial rooms, we make high-fashion styling open, social, and accessible to everyone.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          {pillars.map((p, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 text-lg flex items-center justify-center mb-3.5 shadow-inner">
                {p.emoji}
              </div>
              <h3 className="font-extrabold text-gray-900 text-base mb-1.5">{p.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-black text-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-black text-yellow-300 mb-1">{s.value}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MEET THE FOUNDER SECTION */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl flex flex-col md:flex-row gap-8 items-center text-left">
        
        {/* INITIALS AVATAR MONOGRAM (NO PHOTO) */}
        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white text-4xl font-black shadow-lg flex-shrink-0 select-none border-4 border-yellow-300">
          SS
        </div>

        {/* PROFILE BIO */}
        <div className="flex-1">
          <span className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Chief Product Architect
          </span>
          <h2 className="text-3xl font-black text-gray-900 mt-3.5 mb-1 tracking-tight">
            Sanya Singla
          </h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Founder, StyleSnap+
          </p>
          
          <div className="text-gray-600 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
            <p>
              "Fashion is the ultimate form of self-expression, but finding your unique style shouldn't require a Hollywood budget or endless hours of scrolling. We built StyleSnap+ to merge advanced deep-learning try-on neural networks with human taste DNA."
            </p>
            <p>
              "By creating an environment where users can sequence their style preferences, interact with influencer hotspots, and instantly swap garments onto their own photos, we are building the future of the decentralized digital closet."
            </p>
          </div>
          
          {/* Quote sign off */}
          <div className="mt-6 border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400">
            <span>Delhi, India</span>
            <span className="font-serif italic font-bold text-gray-800 text-sm">Sanya Singla</span>
          </div>
        </div>

      </div>
    </div>
  )
}

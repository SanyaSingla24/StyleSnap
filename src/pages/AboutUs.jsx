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
    <div className="h-full animate-fade-in max-w-2xl mx-auto">
      {/* HERO SECTION */}
      <div className="mb-5 text-center">
        <span className="text-[10px] font-bold text-gray-500 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 rounded-full uppercase tracking-widest border border-gray-200 dark:border-zinc-700 shadow-sm">
          Our Vision
        </span>
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mt-2 mb-1">
          StyleSnap+ Story
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
          Bridging advanced deep-learning vision pipelines with personal fashion self-expression.
        </p>
      </div>

      {/* THE VISION GRID */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-150 dark:border-zinc-800 shadow-md mb-5 text-left">
        <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-3">
          Reimagining the Digital Wardrobe
        </h2>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-5 text-xs font-medium">
          StyleSnap+ was born from a simple question: What if you could try on any item instantly? By replacing flat photo grids with interactive visual hotspots and virtual trial rooms, we make high-fashion styling open, social, and accessible.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          {pillars.map((p, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="w-8 h-8 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 text-base flex items-center justify-center mb-2.5 shadow-sm">
                {p.emoji}
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-xs mb-1">{p.title}</h3>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-black dark:bg-zinc-950 text-white rounded-xl p-4 text-center shadow-md">
            <div className="text-lg font-black text-[#FBBF24] mb-0.5">{s.value}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MEET THE FOUNDER SECTION */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-150 dark:border-zinc-800 shadow-md flex flex-col sm:flex-row gap-5 items-center text-left">
        {/* INITIALS AVATAR */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-black shadow-md flex-shrink-0 select-none border-2 border-yellow-300">
          SS
        </div>

        {/* PROFILE BIO */}
        <div className="flex-1">
          <span className="text-[9px] bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Chief Product Architect
          </span>
          <h2 className="text-base font-black text-gray-900 dark:text-white mt-2 mb-0.5 tracking-tight">
            Sanya Singla
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Founder, StyleSnap+
          </p>
          
          <div className="text-gray-500 dark:text-gray-400 text-[10px] leading-relaxed space-y-2 font-medium">
            <p>"Fashion is the ultimate form of self-expression, but finding your unique style shouldn't require a Hollywood budget. We built StyleSnap+ to merge advanced deep-learning try-on neural networks with human taste DNA."</p>
          </div>
          
          {/* Quote sign off */}
          <div className="mt-3 border-t border-gray-100 dark:border-zinc-800 pt-2.5 flex justify-between items-center text-[10px] text-gray-400">
            <span>Delhi, India</span>
            <span className="font-serif italic font-bold text-gray-700 dark:text-gray-300 text-xs">Sanya Singla</span>
          </div>
        </div>

      </div>
    </div>
  )
}

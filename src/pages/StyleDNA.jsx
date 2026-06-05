import { useState, useEffect } from "react"

const AESTHETICS = [
  {
    id: "quiet_luxury",
    name: "Quiet Luxury / Minimalist",
    description: "Clean cuts, soft neutral knitwear, leather loafers, and high-end timeless wardrobe pieces.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600",
    quote: "Simplicity is the ultimate sophistication."
  },
  {
    id: "streetwear",
    name: "Edgy Streetwear",
    description: "Oversized graphic tees, baggy cargo pants, chunky sneakers, and bold statement accessories.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    quote: "Own the streets, define the culture."
  },
  {
    id: "desi_glam",
    name: "Desi Glam / Indo-Western",
    description: "Vibrant ethnic prints, intricate hand embroidery, modern drape details, and silver oxidized jewelry.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    quote: "Heritage meets modern styling."
  },
  {
    id: "corporate_chic",
    name: "Corporate Chic",
    description: "Sharp blazers, crisp tailored trousers, sleek silk shirts, and clean modern styling for work and beyond.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    quote: "Dress like you mean business."
  },
  {
    id: "retro_vintage",
    name: "Retro / Vintage Vibe",
    description: "High-waist denim, collared shirts, striped tees, leather jackets, and nostalgic 90s aesthetic accents.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600",
    quote: "Timeless styles, reimagined."
  },
  {
    id: "boho_aesthetic",
    name: "Bohemian Chic",
    description: "Flowy maxi dresses, floral prints, suede boots, fringed details, and stacked turquoise rings.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
    quote: "Breathe in the wild, look like a dream."
  }
]

const PALETTES = [
  {
    id: "warm_neutrals",
    name: "Warm Neutrals",
    colors: [
      { name: "Cream", hex: "#FDFBF7" },
      { name: "Beige", hex: "#EAE5D9" },
      { name: "Taupe", hex: "#C4B59F" },
      { name: "Tan", hex: "#8D7A68" }
    ]
  },
  {
    id: "deep_jewels",
    name: "Deep Jewels",
    colors: [
      { name: "Emerald", hex: "#0A5C36" },
      { name: "Sapphire", hex: "#0F4C81" },
      { name: "Ruby Red", hex: "#9B111E" },
      { name: "Amethyst", hex: "#6A287E" }
    ]
  },
  {
    id: "pastel_sky",
    name: "Pastel Sky",
    colors: [
      { name: "Mint", hex: "#E2F0D9" },
      { name: "Lavender", hex: "#E2D9F0" },
      { name: "Baby Blue", hex: "#D9E2F0" },
      { name: "Blush Pink", hex: "#F0D9E5" }
    ]
  },
  {
    id: "dark_monochrome",
    name: "Dark Monochrome",
    colors: [
      { name: "Charcoal", hex: "#3A3B3C" },
      { name: "Obsidian", hex: "#1A1A1A" },
      { name: "Pitch Black", hex: "#0B0C10" },
      { name: "Ash Grey", hex: "#7F8C8D" }
    ]
  },
  {
    id: "vibrant_pop",
    name: "Vibrant Pop",
    colors: [
      { name: "Sun Yellow", hex: "#FFEA00" },
      { name: "Neon Green", hex: "#39FF14" },
      { name: "Hot Pink", hex: "#FF1493" },
      { name: "Tangerine", hex: "#FF5722" }
    ]
  }
]

const FITS = [
  {
    id: "oversized",
    name: "Oversized & Relaxed",
    description: "Loose, comfortable silhouettes offering effortless streetwear comfort and cool-kid posture."
  },
  {
    id: "tailored",
    name: "Tailored & Fitted",
    description: "Sharp, structural silhouettes highlighting clean borders, waistlines, and formal details."
  },
  {
    id: "drapey",
    name: "Drapey & Flowing",
    description: "Graceful, sweeping lines with fabric that cascades, giving a romantic and artistic outline."
  },
  {
    id: "mixed",
    name: "Mixed & Layered",
    description: "Combining structural inner layers with loose outer garments to create complex, interesting textures."
  }
]

export default function StyleDNA({ setPage }) {
  const [dna, setDna] = useState(null)
  const [step, setStep] = useState(0) // 0: Onboarding, 1: Aesthetic, 2: Colors, 3: Fit, 4: Loading, 5: Result Card
  const [selectedAesthetic, setSelectedAesthetic] = useState(null)
  const [selectedPalette, setSelectedPalette] = useState(null)
  const [selectedFit, setSelectedFit] = useState(null)
  const [loadingText, setLoadingText] = useState("")

  // Load existing DNA from localStorage on mount
  useEffect(() => {
    const savedDna = localStorage.getItem("stylesnap_styledna")
    if (savedDna) {
      try {
        setDna(JSON.parse(savedDna))
        setStep(5)
      } catch (err) {
        console.error("Failed to parse saved DNA:", err)
      }
    }
  }, [])

  const startQuiz = () => {
    setSelectedAesthetic(null)
    setSelectedPalette(null)
    setSelectedFit(null)
    setStep(1)
  }

  const handleSelectAesthetic = (aesthetic) => {
    setSelectedAesthetic(aesthetic)
    setStep(2)
  }

  const handleSelectPalette = (palette) => {
    setSelectedPalette(palette)
    setStep(3)
  }

  const handleSelectFit = (fit) => {
    setSelectedFit(fit)
    triggerAnalysis(fit)
  }

  const triggerAnalysis = (fitVal) => {
    setStep(4)
    const phases = [
      "Starching cotton collars...",
      "Analyzing outfit ratios and fit profiles...",
      "Threading design needles...",
      "Consulting style lookbooks...",
      "Polishing dress shoes & sneakers...",
      "Generating custom Style DNA signature..."
    ]
    
    let curPhase = 0
    setLoadingText(phases[0])
    
    const interval = setInterval(() => {
      curPhase++
      if (curPhase < phases.length) {
        setLoadingText(phases[curPhase])
      } else {
        clearInterval(interval)
        // Compile DNA and save
        const calculatedDna = {
          aesthetic: selectedAesthetic.name,
          aestheticId: selectedAesthetic.id,
          quote: selectedAesthetic.quote,
          paletteName: selectedPalette.name,
          colors: selectedPalette.colors,
          fit: fitVal.name,
          bio: generateBio(selectedAesthetic.id, selectedPalette.id, fitVal.id),
          essentials: generateEssentials(selectedAesthetic.id)
        }
        localStorage.setItem("stylesnap_styledna", JSON.stringify(calculatedDna))
        setDna(calculatedDna)
        setStep(5)
      }
    }, 900)
  }

  const generateBio = (aes, pal, fit) => {
    const aesNames = {
      quiet_luxury: "a curator of Quiet Luxury who values exquisite understatements and clean architecture.",
      streetwear: "an urban rebel who uses oversized silhouettes and active street themes to voice style.",
      desi_glam: "a lover of Desi Glam who celebrates traditional embroidery blended with modern contours.",
      corporate_chic: "a powerhouse of Corporate Chic who values razor-sharp cuts, blazers, and clean executive coordination.",
      retro_vintage: "a nostalgic retro fan who loves vintage denim, classic colors, and heritage polo designs.",
      boho_aesthetic: "a free-spirited bohemian soul who wears fluid patterns and soft, earthy layers."
    }
    const palNames = {
      warm_neutrals: "Your color signature leans towards warm earthy tones that feel organic and grounded.",
      deep_jewels: "You stand out in rich jewel tones, projecting authority, richness, and dramatic depth.",
      pastel_sky: "You prefer light pastel shades that evoke soft mornings, clean minimalism, and approachability.",
      dark_monochrome: "Your color statement is pitch monochrome—dark, mysterious, and effortlessly sharp.",
      vibrant_pop: "You are bold, wearing energetic pops of neon and bright hues that project fun and absolute confidence."
    }
    const fitNames = {
      oversized: "You gravitate towards relaxed, comfy shapes that hang beautifully.",
      tailored: "You prefer custom, structured tailoring that fits closely to outline clean lines.",
      drapey: "You favor cascading and flowing designs that add poetic movement as you walk.",
      mixed: "You love layering fitted layers inside loose outers to craft intricate geometric depth."
    }
    return `You are ${aesNames[aes] || "a stylish explorer."} ${palNames[pal] || ""} ${fitNames[fit] || ""}`
  }

  const generateEssentials = (aes) => {
    const items = {
      quiet_luxury: ["Fine Cashmere Crewneck Sweater", "Camel Wool Overcoat", "Leather Loafers", "Minimalist Gold Band"],
      streetwear: ["Oversized Premium Hoodie", "Heavyweight Cargo Pants", "Chunky Retro Sneakers", "Silver Chain Necklace"],
      desi_glam: ["Embroidered Cotton Kurti", "Oxford Cotton Pajama-Trouser", "Hand-crafted Juttis", "Silver oxidized hoops"],
      corporate_chic: ["Double-Breasted Structured Blazer", "Silk Collared Shirt", "High-Waist Wide Trousers", "Pointed Leather Mules"],
      retro_vintage: ["Classic 90s Denim Jacket", "Retro Collared Polo Shirt", "Straight-Leg Selvedge Jeans", "Classic Leather Belt"],
      boho_aesthetic: ["Flowing Tiered Maxi Dress", "Suede Ankle Boots", "Beaded Layered Necklaces", "Fringed Kimono Cardigan"]
    }
    return items[aes] || ["Premium Solid Tee", "Dark Tailored Denim", "White Canvas Sneakers"]
  }

  const resetQuiz = () => {
    localStorage.removeItem("stylesnap_styledna")
    setDna(null)
    setStep(0)
  }

  return (
    <div className="h-full min-h-[85vh] flex flex-col justify-center items-center py-6 px-4">
      
      {/* 0: ONBOARDING SCREEN */}
      {step === 0 && (
        <div className="max-w-xl text-center bg-white rounded-2xl p-6 border border-gray-200 shadow-xl animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-yellow-300 text-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            🧬
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            Discover Your Style DNA.
          </h1>
          <p className="text-gray-655 font-semibold text-sm leading-relaxed mb-5">
            Complete a visual, 3-step styling questionnaire to uncover your personal aesthetic, signature colors, and fit preferences.
            <br />
            <span className="text-gray-900 font-extrabold text-xs block mt-2">
              ✦ Personalizes the AI Stylist's feedback automatically
            </span>
          </p>
          <button
            onClick={startQuiz}
            className="w-full bg-black text-white hover:bg-yellow-400 hover:text-black py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-98 transition-all duration-300"
          >
            Start Styling DNA Quiz ✦
          </button>
        </div>
      )}

      {/* 1: CHOOSE AESTHETIC SCREEN */}
      {step === 1 && (
        <div className="w-full max-w-5xl text-center animate-fade-in">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
            Step 1 of 3
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-3 mb-1">
            Which fashion aesthetic represents you?
          </h1>
          <p className="text-gray-500 mb-8 font-medium">Select your primary style vibe</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AESTHETICS.map((aes) => (
              <button
                key={aes.id}
                onClick={() => handleSelectAesthetic(aes)}
                className="group text-left bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-black active:scale-98 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 w-full overflow-hidden relative">
                  <img
                    src={aes.image}
                    alt={aes.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                      {aes.name.split("/")[0]}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                    {aes.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {aes.description}
                  </p>
                  <p className="text-xs italic text-gray-400 mt-auto border-t border-gray-100 pt-3">
                    "{aes.quote}"
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2: CHOOSE PALETTE SCREEN */}
      {step === 2 && (
        <div className="w-full max-w-3xl text-center animate-fade-in">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
            Step 2 of 3
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-3 mb-1">
            Pick your signature color palette
          </h1>
          <p className="text-gray-500 mb-8 font-medium">Which colors speak to your wardrobe aesthetic?</p>

          <div className="space-y-4">
            {PALETTES.map((pal) => (
              <button
                key={pal.id}
                onClick={() => handleSelectPalette(pal)}
                className="w-full bg-white border border-gray-200 hover:border-black rounded-3xl p-6 shadow-sm hover:shadow-lg transition duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-left active:scale-[0.99]"
              >
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">
                    {pal.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {pal.colors.map(c => c.name).join(" • ")}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  {pal.colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[10px] text-gray-500 font-semibold mt-1">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setStep(1)}
            className="mt-8 text-sm font-bold text-gray-500 hover:text-black transition"
          >
            ← Back to Aesthetics
          </button>
        </div>
      )}

      {/* 3: CHOOSE FIT SCREEN */}
      {step === 3 && (
        <div className="w-full max-w-2xl text-center animate-fade-in">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
            Step 3 of 3
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-3 mb-1">
            What is your preferred silhouette?
          </h1>
          <p className="text-gray-500 mb-8 font-medium">Select how you like your clothing to fit your frame</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FITS.map((fit) => (
              <button
                key={fit.id}
                onClick={() => handleSelectFit(fit)}
                className="bg-white border border-gray-200 hover:border-black rounded-3xl p-6 shadow-sm hover:shadow-lg text-left transition duration-300 active:scale-98 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 font-bold flex items-center justify-center text-sm mb-4">
                    {fit.name[0]}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                    {fit.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {fit.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-8 text-sm font-bold text-gray-500 hover:text-black transition"
          >
            ← Back to Color Palette
          </button>
        </div>
      )}

      {/* 4: LOADING SCREEN */}
      {step === 4 && (
        <div className="max-w-md text-center py-10 animate-pulse">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Sequencing Style DNA...
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            {loadingText}
          </p>
        </div>
      )}

      {/* 5: RESULT SCREEN */}
      {dna && step === 5 && (
        <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
              Style DNA Profile
            </span>
            <h1 className="text-3xl font-black text-gray-900 mt-2">
              Your Fashion Identity Signature
            </h1>
          </div>

          {/* DYNAMIC glassmorphic VIP CARD */}
          <div className="w-full max-w-md bg-gradient-to-tr from-gray-900 to-black text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-gray-800">
            {/* Glossy overlay reflection */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl" />
            
            {/* Card Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] text-yellow-300 font-bold uppercase tracking-widest block mb-1">
                  Stylesnap+ VIP
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-tight">
                  DNA CARD // SEC-001
                </span>
              </div>
              <div className="text-2xl">🧬</div>
            </div>

            {/* Aesthetic Title */}
            <div className="mb-8">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">
                Primary Aesthetic
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1">
                {dna.aesthetic}
              </h2>
              <p className="text-xs italic text-yellow-300/80 mt-1">
                "{dna.quote}"
              </p>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-6 mb-6">
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">
                  Color Scheme
                </span>
                <span className="text-sm font-extrabold text-white">
                  {dna.paletteName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">
                  Fit Profile
                </span>
                <span className="text-sm font-extrabold text-white">
                  {dna.fit}
                </span>
              </div>
            </div>

            {/* Colors Swatch */}
            <div className="flex gap-2">
              {dna.colors?.map((col, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full border border-white/20 shadow-inner group relative"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>

            {/* Hologram style bottom badge */}
            <div className="mt-8 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <span>STYLESNAP+ DNA VERIFIED</span>
              <span className="bg-yellow-300 text-black px-2 py-0.5 rounded font-black">
                ACTIVE
              </span>
            </div>
          </div>

          {/* ANALYSIS & DETAILS CARD */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 mt-6 shadow-sm">
            <h3 className="font-extrabold text-gray-900 text-lg mb-3">
              Style Personality
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              {dna.bio}
            </p>

            <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-widest mb-3 border-t border-gray-100 pt-4">
              🔑 Wardrobe Essentials to Own
            </h3>
            <ul className="grid grid-cols-1 gap-2">
              {dna.essentials?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 w-full max-w-md mt-6">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3.5 border border-black rounded-2xl text-sm font-extrabold hover:bg-gray-50 transition active:scale-95"
            >
              Reset DNA Profile
            </button>
            <button
              onClick={() => {
                if (setPage) {
                  setPage("The Shop")
                } else {
                  alert("Your Style DNA is active! Go to 'The Shop' to see it in action.")
                }
              }}
              className="flex-1 py-3.5 bg-black text-white hover:bg-yellow-400 hover:text-black rounded-2xl text-sm font-extrabold transition active:scale-95 shadow-md"
            >
              Explore Shop Matches
            </button>
          </div>
        </div>
      )}

      {/* Basic animations helper */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />

    </div>
  )
}

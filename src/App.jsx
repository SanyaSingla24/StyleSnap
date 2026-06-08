import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import StyleStudio from "./pages/StyleStudio"
import Feed from "./pages/Feed"
import Stylists from "./pages/Stylists"
import Shop from "./pages/Shop"
import AITryOn from "./pages/AITryOn"
import Wardrobe from "./pages/Wardrobe"
import Onboarding from "./pages/Onboarding"
import CreatorStudio from "./pages/CreatorStudio"
import StyleDNA from "./pages/StyleDNA"
import AboutUs from "./pages/AboutUs"
import { Menu, Sun, Moon } from "lucide-react"

export default function App() {
  const [page, setPage] = useState("Style Studio")
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [fromShop, setFromShop] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("stylesnap_userid"))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => localStorage.getItem("stylesnap_theme") === "dark")

  const username = localStorage.getItem("stylesnap_username")
  const role = localStorage.getItem("stylesnap_role")

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("stylesnap_theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("stylesnap_theme", "light")
    }
  }, [isDark])

  const roleColors = {
    influencer: { bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300", emoji: "👑" },
    designer:   { bg: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300", emoji: "🧵" },
    shopper:    { bg: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300", emoji: "🛍️" },
  }
  const roleStyle = roleColors[role] || roleColors.shopper

  if (!isLoggedIn) {
    return <Onboarding setIsLoggedIn={setIsLoggedIn} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#1A1A1A] transition-colors duration-200">

      {/* SIDEBAR ON DESKTOP */}
      <div className="hidden md:flex md:w-[220px] md:flex-shrink-0 h-full">
        <Sidebar
          page={page}
          setPage={setPage}
          setFromShop={setFromShop}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      </div>

      {/* SIDEBAR DRAWER ON MOBILE */}
      <div className={`fixed inset-y-0 left-0 z-50 w-56 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-zinc-800`}>
        <Sidebar
          page={page}
          setPage={setPage}
          setFromShop={setFromShop}
          isDark={isDark}
          setIsDark={setIsDark}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* MAIN CONTENT COLUMN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}
        <div className="bg-white dark:bg-[#111111] border-b border-zinc-300 dark:border-zinc-800 px-4 md:px-8 py-2.5 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 h-14">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="md:hidden p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-black text-gray-900 dark:text-white md:hidden ml-2 flex items-center gap-1">
              ✨ StyleSnap+
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-none">Logged in as</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">@{username}</p>
              </div>
              <span className={`${roleStyle.bg} text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 capitalize`}>
                <span>{roleStyle.emoji}</span> {role}
              </span>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 bg-[#FBBF24] dark:bg-[#1A1A1A] px-4 py-3 md:px-8 md:py-5 overflow-y-auto transition-colors duration-200 relative">
          <div className="max-w-[1000px] mx-auto w-full pb-16">
            {page === "Style Studio" && (
              <StyleStudio page={page} setPage={setPage} />
            )}
            {page === "AI Try-On" && (
              <AITryOn
                page={page}
                setPage={setPage}
                selectedOutfit={selectedOutfit}
                fromShop={fromShop}
              />
            )}
            {page === "The Feed" && (
              <Feed
                setPage={setPage}
                setSelectedOutfit={setSelectedOutfit}
                setFromShop={setFromShop}
              />
            )}
            {page === "Stylists" && <Stylists />}
            {page === "Style DNA" && <StyleDNA setPage={setPage} />}
            {page === "Wardrobe" && <Wardrobe setPage={setPage} />}
            {page === "Creator Studio" && <CreatorStudio />}
            {page === "About Us" && <AboutUs />}
            {page === "The Shop" && (
              <Shop
                setPage={setPage}
                setSelectedOutfit={setSelectedOutfit}
                setFromShop={setFromShop}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}







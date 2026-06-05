import { useState } from "react"
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

export default function App() {
  const [page, setPage] = useState("Style Studio")
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [fromShop, setFromShop] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("stylesnap_userid"))

  const username = localStorage.getItem("stylesnap_username")
  const role = localStorage.getItem("stylesnap_role")

  const roleColors = {
    influencer: { bg: "bg-yellow-100", text: "text-yellow-800", emoji: "👑" },
    designer:   { bg: "bg-purple-100", text: "text-purple-800", emoji: "🧵" },
    shopper:    { bg: "bg-blue-100",   text: "text-blue-800",   emoji: "🛍️" },
  }
  const roleStyle = roleColors[role] || roleColors.shopper

  if (!isLoggedIn) {
    return <Onboarding setIsLoggedIn={setIsLoggedIn} />
  }

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar
        page={page}
        setPage={setPage}
        setFromShop={setFromShop}
      />

      {/* MAIN CONTENT COLUMN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}
        <div className="bg-yellow-300 border-b border-yellow-400 px-8 py-3 flex items-center justify-end gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-xs text-gray-600 font-medium">Logged in as</p>
              <p className="text-sm font-extrabold text-gray-900">@{username}</p>
            </div>
          </div>
          <span className={`${roleStyle.bg} ${roleStyle.text} text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 capitalize`}>
            <span>{roleStyle.emoji}</span> {role}
          </span>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 bg-yellow-300 p-4 md:p-8 overflow-y-auto">
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
  )
}







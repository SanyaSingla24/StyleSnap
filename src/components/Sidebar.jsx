import { Sparkles, Shirt, Compass, Dna, Heart, Users, ShoppingBag, Info, Palette, LogOut, X } from "lucide-react"

export default function Sidebar({ page, setPage, setFromShop, onClose }) {
  const role = localStorage.getItem("stylesnap_role");

  const menuItems = [
    { name: "Style Studio", icon: Sparkles },
    { name: "AI Try-On", icon: Shirt },
    { name: "The Feed", icon: Compass },
    { name: "Style DNA", icon: Dna },
    { name: "Wardrobe", icon: Heart },
    { name: "Stylists", icon: Users },
    { name: "The Shop", icon: ShoppingBag },
    { name: "About Us", icon: Info },
  ]

  if (role === "designer") {
    menuItems.push({ name: "Creator Studio", icon: Palette });
  }

  const handleLogout = () => {
    localStorage.removeItem("stylesnap_username");
    localStorage.removeItem("stylesnap_userid");
    localStorage.removeItem("stylesnap_role");
    localStorage.removeItem("stylesnap_token");
    window.location.reload();
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-zinc-800 px-4 py-6 flex flex-col transition-colors duration-200">
      
      {/* HEADER WITH LOGO & CLOSE ON MOBILE */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-left">
          <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
            ✨ StyleSnap+
          </h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">
            AI Fashion Stylist
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1 overflow-y-auto flex-1 pr-1 scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = page === item.name
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => {
                setPage(item.name)
                setFromShop(false)
                if (onClose) onClose()
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-2.5 ${
                isActive
                  ? "bg-[#FBBF24] text-[#1C1C1C] shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-3">
        {/* Subtle decorative fashion pattern */}
        <div className="opacity-20 dark:opacity-10 flex items-center justify-center gap-3 py-1.5 select-none pointer-events-none border-b border-gray-100 dark:border-zinc-900 pb-2">
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.37 8.91l-8-1.7a2 2 0 00-1.64.44l-6.4 5.3a2 2 0 00.32 3.26l7.8 4.4a2 2 0 002.16-.16l6.4-5.3a2 2 0 00-.64-3.24z"/>
          </svg>
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3c0 .8.4 1.5 1 2l-7.2 8.2a1.5 1.5 0 0 0 1.1 2.5h16.2a1.5 1.5 0 0 0 1.1-2.5L14 7c.6-.5 1-1.2 1-2a3 3 0 0 0-3-3z"/>
          </svg>
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 6V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2L3.62 3.46a1 1 0 0 0-1.34.45L1.1 6.05a1 1 0 0 0 .3 1.25L5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9l3.6-2.7a1 1 0 0 0 .3-1.25l-1.18-2.14a1 1 0 0 0-1.34-.44z"/>
          </svg>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
        <div className="text-[10px] text-gray-400 dark:text-gray-600 text-center">
          © 2026 StyleSnap+
        </div>
      </div>
    </div>
  )
}

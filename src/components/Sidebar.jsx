export default function Sidebar({ page, setPage, setFromShop }) {
  const role = localStorage.getItem("stylesnap_role");
  
  const menuItems = [
    "Style Studio",
    "AI Try-On",
    "The Feed",
    "Style DNA",
    "Wardrobe",
    "Stylists",
    "The Shop",
    "About Us"
  ]

  if (role === "influencer" || role === "designer") {
    menuItems.push("Creator Studio");
  }

  const handleLogout = () => {
    localStorage.removeItem("stylesnap_username");
    localStorage.removeItem("stylesnap_userid");
    localStorage.removeItem("stylesnap_role");
    localStorage.removeItem("stylesnap_token");
    window.location.reload();
  };

  return (
    <div className="w-64 min-h-screen bg-[#FAFAF5] border-r border-gray-300 px-6 py-8 flex flex-col">
      
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          ✨ StyleSnap+
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          AI Fashion Stylist
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = page === item

          return (
            <button
              key={item}
              onClick={() => {
                setPage(item)
                setFromShop(false)
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-yellow-300 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto flex flex-col gap-4">
        <button 
          onClick={handleLogout}
          className="w-full bg-black text-white py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
        <div className="text-xs text-gray-400 text-center">
          © 2026 StyleSnap+
        </div>
      </div>
    </div>
  )
}

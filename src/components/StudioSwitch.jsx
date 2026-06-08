import { Sparkles, Shirt } from "lucide-react"

export default function StudioSwitch({ page, setPage }) {
  const tabs = [
    { name: "Style Studio", icon: Sparkles },
    { name: "AI Try-On", icon: Shirt },
  ]

  return (
    <div className="flex border-b border-black/10 dark:border-zinc-800 mb-6 relative w-full text-left">
      {tabs.map((tab) => {
        const isActive = page === tab.name
        const Icon = tab.icon

        return (
          <button
            key={tab.name}
            onClick={() => setPage(tab.name)}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 -mb-[2px] relative z-10 active:scale-98 ${isActive
                ? "border-zinc-900 dark:border-[#FBBF24] text-gray-900 dark:text-[#FBBF24]"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        )
      })}
    </div>
  )
}

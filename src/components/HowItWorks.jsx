export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Upload Photo",
      desc: "Take a clear, well-lit photo of your complete outfit"
    },
    {
      id: 2,
      title: "AI Analysis",
      desc: "Get instant feedback on style, colors, and fit"
    },
    {
      id: 3,
      title: "Stylist Tips",
      desc: "Receive styling suggestions and pose suggestions"
    }
  ]

  return (
    <div className="w-full pt-4 pb-2">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {steps.map(step => (
          <div
            key={step.id}
            className="bg-white dark:bg-zinc-900/60 rounded-xl p-3 md:p-4 text-center border border-gray-150 dark:border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
          >
            <div className="w-6 h-6 md:w-7 md:h-7 bg-[#FBBF24] text-[#1C1C1C] rounded-full flex items-center justify-center mx-auto mb-2 font-black text-xs md:text-xs">
              {step.id}
            </div>

            <h4 className="text-[10px] md:text-xs font-black mb-1 text-gray-900 dark:text-white leading-tight">
              {step.title}
            </h4>

            <p className="text-gray-400 dark:text-gray-500 text-[9px] md:text-[10px] font-bold leading-tight">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


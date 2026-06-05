export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Upload Your Photo",
      desc: "Take a clear, well-lit photo of your complete outfit"
    },
    {
      id: 2,
      title: "AI Analysis",
      desc: "Get instant feedback on style, colors, and fit"
    },
    {
      id: 3,
      title: "Personalized Tips",
      desc: "Receive styling suggestions and pose recommendations"
    }
  ]

  return (
    <div className="bg-yellow-400 pb-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {steps.map(step => (
          <div
            key={step.id}
            className="bg-white rounded-2xl p-6 text-center shadow-md"
          >
            <div className="w-10 h-10 bg-black text-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              {step.id}
            </div>

            <h4 className="text-lg font-semibold mb-1">
              {step.title}
            </h4>

            <p className="text-gray-600 text-sm">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


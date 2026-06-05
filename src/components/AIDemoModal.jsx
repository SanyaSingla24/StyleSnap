import { useState, useEffect, useRef } from "react";

// Helper function to render text with Markdown-style links [text](url)
const renderWithLinks = (text) => {
  if (typeof text !== "string") return text;
  
  const parts = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the link element
    parts.push(
      <a 
        key={match.index} 
        href={match[2]} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 font-medium"
      >
        {match[1]}
      </a>
    );
    
    lastIndex = linkRegex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

export default function AIDemoModal({ onClose, data, outfitImage }) {
  const isDemo = !data;

  // Use dynamic data or fallback to demo data
  const score = data?.score || "9.2"
  const tips = data?.tips || [
    "🎨 Great color coordination",
    "👟 Consider [loafers](https://www.google.com/search?tbm=shop&q=loafers) for a polished look",
    "⌚ A watch would complete this outfit"
  ]
  const pose = data?.pose || "Try a confident stance with one hand in pocket"
  const badge = data?.badge || "Perfect for LinkedIn"
  const headerTitle = isDemo ? "✨ AI Style Analysis Demo" : "✨ AI Style Analysis Results"

  // Chatbot State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [styleDNA, setStyleDNA] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("stylesnap_styledna");
    if (saved) {
      try {
        setStyleDNA(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse Style DNA in modal:", err);
      }
    }
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/style-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: { score, tips, pose, badge },
          styleDNA: styleDNA
        })
      });

      if (!res.ok) throw new Error("Chat request failed");
      
      const resData = await res.json();
      setMessages([...newMessages, { role: "assistant", content: resData.response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-yellow-400 rounded-3xl w-full max-w-4xl h-[90vh] md:h-[80vh] p-4 md:p-6 relative shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6 transition-all overflow-hidden">
        
        {/* Left Side: Original Analysis */}
        <div className="w-full md:w-1/2 flex flex-col h-[40%] md:h-full overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={onClose}
            className="md:hidden absolute top-3 right-4 text-xl font-bold hover:scale-110 transition z-10 bg-white/50 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur"
          >
            ✕
          </button>

          <h3 className="font-bold mb-4 text-xl md:text-2xl">{headerTitle}</h3>

          <div className="bg-gray-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden border border-black/10 min-h-[160px] flex-shrink-0">
            {outfitImage ? (
              <img src={outfitImage} alt="Analyzed Outfit" className="w-full h-auto object-contain max-h-48 md:max-h-60" />
            ) : (
              <span className="text-gray-500 py-10 font-medium">📷 Your Outfit</span>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 mb-3 border border-black/10 shadow-sm flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">AI Score</span>
              <span className="text-3xl font-black text-black">{score}</span>
            </div>
            <div className="text-yellow-500 text-sm mt-1">
              {"⭐".repeat(Math.round(parseFloat(score) / 2) || 5)}
            </div>
          </div>

          <div className="bg-yellow-300 rounded-xl p-4 mb-3 border border-black/5 shadow-inner">
            <h4 className="font-bold mb-2 text-lg text-gray-900">✨ AI Styling Tips</h4>
            <ul className="text-sm space-y-2 text-gray-800 font-medium">
              {tips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed flex gap-2">
                  <span className="text-black">•</span>
                  <span>{renderWithLinks(tip)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-300 rounded-xl p-4 mb-4 border border-black/5 shadow-inner">
            <h4 className="font-bold mb-3 text-lg text-gray-900 flex items-center gap-2">📸 Pose Recommendation</h4>
            <div className="flex gap-4 items-start">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop" 
                alt="Pose Reference" 
                className="w-20 h-20 rounded-xl object-cover shadow-sm border border-black/10 flex-shrink-0" 
              />
              <div>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{pose}</p>
                <span className="inline-block mt-3 text-xs bg-pink-600 text-white px-3 py-1 rounded-full font-bold shadow-sm uppercase tracking-wider">
                  {badge}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl flex flex-col h-[60%] md:h-full overflow-hidden border-2 border-black shadow-lg relative">
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-3 right-3 text-xl font-bold hover:bg-gray-100 transition z-10 text-gray-400 hover:text-black w-8 h-8 rounded-full items-center justify-center"
          >
            ✕
          </button>
          
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                💬 Stylist Chat
              </h4>
              {styleDNA && (
                <span className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  🧬 {styleDNA.aesthetic} DNA
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">Ask where to buy items or how to improve your look!</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10 space-y-1">
                <p>Curious about where to buy the suggested items?</p>
                <p>Or what pants go with this shirt?</p>
                <p className="mt-4 font-bold text-gray-600">Ask your AI Stylist! 👇</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user' ? 'bg-black text-white rounded-br-none font-medium' : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none leading-relaxed'}`}>
                  {renderWithLinks(msg.content)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3.5 text-sm bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about this outfit..." 
                className="flex-1 bg-gray-100 rounded-full pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition"
              />
              <button 
                type="submit" 
                disabled={isTyping || !inputMessage.trim()}
                className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition transform hover:scale-105 active:scale-95"
              >
                ↑
              </button>
            </form>
          </div>
        </div>
        
      </div>
      
      {/* Custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 20px;
        }
      `}} />
    </div>
  )
}

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Onboarding({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("shopper");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }
      localStorage.setItem("stylesnap_token", data.token);
      localStorage.setItem("stylesnap_username", data.username);
      localStorage.setItem("stylesnap_userid", data._id);
      localStorage.setItem("stylesnap_role", data.role);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-yellow-300 p-12 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-black tracking-tight mb-4">
              ✨ StyleSnap+
            </h1>
            <p className="text-lg text-black/80 font-medium leading-relaxed">
              Join the ultimate AI-powered Fashion Ecosystem.
            </p>
          </div>
          <div className="mt-12 hidden md:block">
            <div className="text-8xl mb-6">🛍️</div>
            <p className="font-bold text-black uppercase tracking-widest text-xs">The Future of Fashion</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-black mb-2">{isLogin ? "Welcome Back." : "Create Account."}</h2>
              <p className="text-gray-500 font-medium">{isLogin ? "Sign in to access your wardrobe." : "Join to personalize your experience."}</p>
            </div>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm font-bold text-yellow-600 hover:text-yellow-700 underline"
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">1. Choose a Username</label>
              <input 
                type="text" 
                placeholder="e.g. style_guru" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">2. Enter Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none font-medium transition-all"
              />
            </div>

            {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">3. Select Your Role</label>
              <div className="grid grid-cols-1 gap-3">
                
                <button 
                  onClick={() => setRole("shopper")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === "shopper" ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <span className="text-3xl">🛍️</span>
                  <div>
                    <h4 className="font-bold text-black mb-1">Shopper</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">I want to discover clothes, try them on with AI, and buy my favorites.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setRole("influencer")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === "influencer" ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <span className="text-3xl">✨</span>
                  <div>
                    <h4 className="font-bold text-black mb-1">Fashion Influencer</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">I want to style AI outfits, post them to the feed, and inspire others.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setRole("designer")}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === "designer" ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <span className="text-3xl">🧵</span>
                  <div>
                    <h4 className="font-bold text-black mb-1">Brand / Designer</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">I want to upload my clothing items to the shop so users can try them on.</p>
                  </div>
                </button>

              </div>
            </div>
            )}

            <button 
              onClick={handleJoin}
              disabled={!username.trim() || !password.trim() || (!isLogin && !role) || loading}
              className="w-full mt-4 bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? "Sign In 🚀" : "Create Account 🚀")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

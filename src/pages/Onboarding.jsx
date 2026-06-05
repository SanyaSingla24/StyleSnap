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
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 my-auto">
        
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-yellow-300 p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mb-3">
              ✨ StyleSnap+
            </h1>
            <p className="text-base text-black/85 font-semibold leading-relaxed">
              Join the ultimate AI-powered Fashion Ecosystem.
            </p>
          </div>
          <div className="mt-8 hidden md:block">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="font-bold text-black uppercase tracking-widest text-[10px]">The Future of Fashion</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{isLogin ? "Welcome Back." : "Create Account."}</h2>
              <p className="text-xs text-gray-500 font-medium leading-tight">{isLogin ? "Sign in to access your wardrobe." : "Join to personalize your experience."}</p>
            </div>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-xs font-bold text-yellow-600 hover:text-yellow-700 underline"
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">1. Choose a Username</label>
              <input 
                type="text" 
                placeholder="e.g. style_guru" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none text-sm font-semibold transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">2. Enter Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none text-sm font-semibold transition-all"
              />
            </div>

            {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">3. Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                
                <button 
                  onClick={() => setRole("shopper")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all text-center ${role === "shopper" ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <span className="text-2xl mb-1">🛍️</span>
                  <span className="font-extrabold text-[11px] text-gray-900">Shopper</span>
                </button>

                <button 
                  onClick={() => setRole("influencer")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all text-center ${role === "influencer" ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <span className="text-2xl mb-1">✨</span>
                  <span className="font-extrabold text-[11px] text-gray-900">Influencer</span>
                </button>

                <button 
                  onClick={() => setRole("designer")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all text-center ${role === "designer" ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <span className="text-2xl mb-1">🧵</span>
                  <span className="font-extrabold text-[11px] text-gray-900">Designer</span>
                </button>

              </div>
            </div>
            )}

            <button 
              onClick={handleJoin}
              disabled={!username.trim() || !password.trim() || (!isLogin && !role) || loading}
              className="w-full mt-2 bg-black text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg text-xs"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (isLogin ? "Sign In 🚀" : "Create Account 🚀")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

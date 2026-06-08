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

  // Real-time password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Too Short", "Weak 🔴", "Fair 🟠", "Good 🟡", "Strong 🟢"];
  const strengthColor = ["bg-gray-200", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row border border-gray-100 my-auto">
        
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-[#FBBF24] text-[#1C1C1C] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Abstract SVG Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="20" cy="20" r="4" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 text-left">
            <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight mb-3">
              ✨ StyleSnap+
            </h1>
            <p className="text-sm text-[#1C1C1C]/80 font-bold leading-relaxed">
              Join the ultimate AI-powered Fashion Ecosystem.
            </p>
          </div>
          <div className="mt-8 hidden md:block relative z-10 text-left">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="font-black text-[#1C1C1C] uppercase tracking-widest text-[9px]">The Future of Fashion</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-6">
            <div className="text-left">
              <h2 className="text-2xl font-black text-gray-900 mb-1">{isLogin ? "Welcome Back." : "Create Account."}</h2>
              <p className="text-xs text-gray-400 font-bold leading-tight">{isLogin ? "Sign in to access your wardrobe." : "Join to personalize your experience."}</p>
            </div>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-xs font-bold text-yellow-600 hover:text-yellow-700 hover:underline active:scale-95 transition-all"
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 text-left">1. Choose a Username</label>
              <input 
                type="text" 
                placeholder="e.g. style_guru" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 border-none ring-1 ring-gray-200/80 text-sm font-semibold transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 text-left">2. Enter Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 border-none ring-1 ring-gray-200/80 text-sm font-semibold transition-all text-gray-800"
              />
              {/* Password strength meter */}
              {password && (
                <div className="mt-2 text-left">
                  <div className="flex gap-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((bar) => (
                      <div 
                        key={bar} 
                        className={`flex-1 h-full transition-all duration-300 ${
                          strength >= bar ? strengthColor[strength] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 mt-1 block">
                    Password Strength: {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5 text-left">3. Select Your Role *</label>
              <div className="grid grid-cols-3 gap-3">
                
                <button 
                  onClick={() => setRole("shopper")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center group active:scale-97 ${
                    role === "shopper" 
                      ? "border-yellow-400 bg-yellow-50/20 ring-2 ring-yellow-400 shadow-sm" 
                      : "border-gray-100 hover:border-yellow-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.08)] bg-white"
                  }`}
                >
                  <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">🛍️</span>
                  <span className="font-black text-[11px] text-gray-800">Shopper</span>
                </button>

                <button 
                  onClick={() => setRole("influencer")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center group active:scale-97 ${
                    role === "influencer" 
                      ? "border-yellow-400 bg-yellow-50/20 ring-2 ring-yellow-400 shadow-sm" 
                      : "border-gray-100 hover:border-yellow-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.08)] bg-white"
                  }`}
                >
                  <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">✨</span>
                  <span className="font-black text-[10px] text-gray-800 leading-none">Fashion<br/>Influencer</span>
                </button>

                <button 
                  onClick={() => setRole("designer")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center group active:scale-97 ${
                    role === "designer" 
                      ? "border-yellow-400 bg-yellow-50/20 ring-2 ring-yellow-400 shadow-sm" 
                      : "border-gray-100 hover:border-yellow-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.08)] bg-white"
                  }`}
                >
                  <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">🧵</span>
                  <span className="font-black text-[11px] text-gray-800">Designer</span>
                </button>

              </div>
            </div>
            )}

            <button 
              onClick={handleJoin}
              disabled={!username.trim() || !password.trim() || (!isLogin && !role) || loading}
              className="w-full mt-4 bg-black text-white px-6 py-3.5 rounded-full font-black uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-97 text-xs"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (isLogin ? "Sign In 🚀" : "Create Account 🚀")}
            </button>

            {/* Social Logins */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink mx-4 text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all text-xs font-bold text-gray-700 shadow-sm active:scale-97"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.54 15.02 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.7 8.91 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.11 2.73-2.36 3.58v2.98h3.8c2.23-2.05 3.61-5.07 3.61-8.66z"/>
                  <path fill="#FBBC05" d="M5.36 14.5c-.24-.7-.36-1.45-.36-2.23s.13-1.53.36-2.23L1.5 7.04C.54 8.97 0 11.12 0 13.5s.54 4.53 1.5 6.46l3.86-2.96z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.8-2.98c-1.05.7-2.4 1.12-4.16 1.12-3.09 0-5.73-2.66-6.66-5.46L1.48 15.7C3.4 19.54 7.35 23 12 23z"/>
                </svg>
                <span>Google</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all text-xs font-bold text-gray-700 shadow-sm active:scale-97"
              >
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.72-1.16 1.86-1.02 2.97 1.1.09 2.24-.55 2.97-1.41z"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

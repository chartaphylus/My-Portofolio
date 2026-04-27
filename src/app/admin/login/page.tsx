"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch custom background from site_settings
    const fetchBg = async () => {
      const { data } = await supabase.from('site_settings').select('login_bg_url').limit(1).single();
      if (data?.login_bg_url) {
        setBgUrl(data.login_bg_url);
      }
    };
    fetchBg();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* Dynamic Background Image */}
      {bgUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
          style={{ backgroundImage: `url(${bgUrl})` }}
        >
          {/* Optional dark overlay so the card stands out */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#0A0A0A] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black"></div>
      )}

      {/* Frosted Glass Card */}
      <div className="relative z-10 w-full max-w-[360px] animate-fade-in-up">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col items-center relative overflow-hidden">
          
          {/* Subtle glow inside the card */}
          <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-white/20 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="mb-8 flex flex-col items-center relative z-10">
             <div className="w-16 h-16 relative mb-4 bg-white/10 rounded-full p-2 border border-white/10 shadow-inner">
               <Image src="/image/Logo.png" alt="Logo" fill className="object-contain p-2" />
             </div>
             <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">Login</h1>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/30 px-1 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-colors text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/30 px-1 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-colors text-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3.5 rounded-xl transition-all mt-8 text-sm shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Verifying..." : "Log In"}
            </button>
          </form>

        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

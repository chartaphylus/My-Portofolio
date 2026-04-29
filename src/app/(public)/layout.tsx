import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { supabase } from "@/lib/supabase";
import CustomCursor from "@/components/CustomCursor";
import FloatingElements from "@/components/FloatingElements";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import StatsTracker from "@/components/StatsTracker";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch profile for global use (like name in footer/navbar)
  const { data: profile } = await supabase.from('profiles').select('*').single();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)]">
      
      {/* Premium Interactive Background */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--theme-primary)]/10 blur-[120px] rounded-full mix-blend-screen animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[var(--theme-text)]/5 blur-[100px] rounded-full mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[var(--theme-primary)]/10 blur-[150px] rounded-full mix-blend-screen animate-blob animation-delay-4000"></div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <PerformanceOptimizer />
      <StatsTracker />
      <CustomCursor />
      <FloatingElements />

      <PublicNavbar profile={profile} />
      
      <main className="flex-1 pt-24 pb-16 relative">
        {children}
      </main>
      
      <PublicFooter profile={profile} />
    </div>
  );
}

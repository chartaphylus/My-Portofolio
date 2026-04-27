"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FaProjectDiagram, FaBriefcase, FaGraduationCap, 
  FaCertificate, FaUser, FaSignOutAlt, FaChartPie, FaCode,
  FaBars, FaTimes, FaPaintBrush, FaEnvelope
} from "react-icons/fa";
import ThemeToggle from "@/components/admin/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
       if (window.innerWidth < 768) setIsSidebarOpen(false);
    };
    handleResize();
  }, [pathname]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
       <span className="text-sm font-medium text-gray-500">Loading workspace...</span>
    </div>
  );
  
  if (!session && pathname !== "/admin/login") return null;
  if (pathname === "/admin/login") return <>{children}</>;

  const menuItems = [
    { name: "Overview", href: "/admin", icon: FaChartPie },
    { name: "Inbox", href: "/admin/messages", icon: FaEnvelope },
    { name: "Profile", href: "/admin/profile", icon: FaUser },
    { name: "Projects", href: "/admin/projects", icon: FaProjectDiagram },
    { name: "Experience", href: "/admin/experience", icon: FaBriefcase },
    { name: "Education", href: "/admin/education", icon: FaGraduationCap },
    { name: "Skills", href: "/admin/skills", icon: FaCode },
    { name: "Certifications", href: "/admin/certifications", icon: FaCertificate },
    { name: "Appearance", href: "/admin/appearance", icon: FaPaintBrush },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 font-sans flex flex-col md:flex-row relative">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#1F1F1F] z-40 sticky top-0">
         <div className="flex items-center gap-3">
           <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
             <FaBars size={20} />
           </button>
           <Image src="/image/Logo.png" alt="Logo" width={32} height={32} className="object-contain" />
         </div>
         <ThemeToggle />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-[100dvh] bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#1F1F1F] flex flex-col z-50
        transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}
      `}>
        {/* Header */}
        <div className={`h-16 flex items-center border-b border-gray-200 dark:border-[#1F1F1F] overflow-hidden shrink-0 ${isSidebarOpen ? 'px-6' : 'px-0 justify-center'}`}>
          {isSidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                 <Image src="/image/Logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                 <span className="font-bold tracking-wide text-sm whitespace-nowrap">WORKSPACE</span>
              </div>
              <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors hidden md:block">
                 <FaBars size={16} />
              </button>
              <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                 <FaTimes size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111] transition-colors" onClick={toggleSidebar} title="Expand Sidebar">
               <Image src="/image/Logo.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 py-3 transition-colors relative group
                  ${isSidebarOpen ? 'px-6' : 'px-0 justify-center'}
                  ${isActive 
                    ? "text-black dark:text-white font-medium" 
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#111]"
                  }`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-md"></div>
                )}
                <item.icon size={18} className={`flex-shrink-0 ${isActive ? "text-cyan-500" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                {isSidebarOpen && <span className="text-sm whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className={`p-4 border-t border-gray-200 dark:border-[#1F1F1F] flex flex-col gap-2 shrink-0 ${!isSidebarOpen && 'items-center'}`}>
          {isSidebarOpen ? (
            <div className="flex items-center justify-between px-2 py-2 mb-2 bg-gray-50 dark:bg-[#111] rounded-lg">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">THEME</span>
              <ThemeToggle />
            </div>
          ) : (
            <div className="mb-4">
              <ThemeToggle />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ${isSidebarOpen ? 'px-2 py-2' : 'justify-center p-2'}`}
            title={!isSidebarOpen ? "Sign Out" : undefined}
          >
            <FaSignOutAlt size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 bg-white dark:bg-black min-h-[100dvh]">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in overflow-x-hidden">
          {children}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

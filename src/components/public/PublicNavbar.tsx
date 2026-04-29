"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

export default function PublicNavbar({ profile }: { profile: any }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--theme-bg)]/80 backdrop-blur-xl border-b border-[var(--theme-text)]/10 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <Link href="/" className="font-black text-sm sm:text-lg tracking-tighter hover:opacity-80 transition-opacity whitespace-nowrap uppercase italic flex items-center gap-1 shrink-0">
          {profile?.name || 'M.K Bahtiar'}
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]"></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-[var(--theme-primary)] relative group ${
                  isActive ? 'text-[var(--theme-text)]' : 'text-[var(--theme-text)]/40'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-[var(--theme-primary)] transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          {mounted ? (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/5 transition-all text-[var(--theme-text)] hover:bg-[var(--theme-primary)] hover:text-white hover:rotate-12 active:scale-90 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FaSun size={14} className="animate-in zoom-in duration-300" /> : <FaMoon size={14} className="animate-in zoom-in duration-300" />}
            </button>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/5 animate-pulse" />
          )}

          <button 
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/5 text-[var(--theme-text)]"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars size={16} />
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[150] md:hidden transition-all duration-500 ${menuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        ></div>
        
        {/* Drawer Side */}
        <div className={`absolute right-0 top-0 bottom-0 w-64 sm:w-80 bg-[var(--theme-bg)]/95 backdrop-blur-xl border-l border-[var(--theme-text)]/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--theme-text)]/5">
            <span className="font-bold text-[10px] uppercase tracking-widest text-[var(--theme-text)]/40">Menu</span>
            <button 
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--theme-text)]/5 text-[var(--theme-text)] hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={`group flex items-center gap-4 transition-all duration-500 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                >
                  <span className={`text-[10px] font-mono transition-colors ${isActive ? 'text-[var(--theme-primary)]' : 'text-[var(--theme-text)]/20'}`}>
                    0{i+1}
                  </span>
                  <span className={`text-lg font-medium tracking-wide transition-all ${
                    isActive ? 'text-[var(--theme-primary)]' : 'text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] group-hover:translate-x-1'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--theme-text)]/5 bg-[var(--theme-text)]/[0.02]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30 mb-1">Signed in as</p>
            <p className="text-xs font-semibold text-[var(--theme-text)]/70 truncate">{profile?.name || 'Guest'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

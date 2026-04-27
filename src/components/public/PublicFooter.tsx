"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaFacebook, FaMedium } from "react-icons/fa";

export default function PublicFooter({ profile }: { profile: any }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.02] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-2">{profile?.name || "M. Khafid Bahtiar"}</h3>
            <p className="text-sm text-[var(--theme-text)]/60 max-w-xs">
              {profile?.tagline || "Building high-quality digital experiences."}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
               <a href={`mailto:${profile.email}`} className="text-[var(--theme-text)]/50 hover:text-[var(--theme-text)] transition-colors">
                 <FaEnvelope size={18} />
               </a>
            )}
            {profile?.socials?.github && (
               <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-[var(--theme-text)]/50 hover:text-[var(--theme-text)] transition-colors">
                 <FaGithub size={18} />
               </a>
            )}
            {profile?.socials?.linkedin && (
               <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--theme-text)]/50 hover:text-[var(--theme-text)] transition-colors">
                 <FaLinkedin size={18} />
               </a>
            )}
            {profile?.socials?.instagram && (
               <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--theme-text)]/50 hover:text-[var(--theme-primary)] transition-colors">
                 <FaInstagram size={18} />
               </a>
            )}
            {profile?.socials?.facebook && (
               <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[var(--theme-text)]/50 hover:text-[var(--theme-primary)] transition-colors">
                 <FaFacebook size={18} />
               </a>
            )}
            {profile?.socials?.medium && (
               <a href={profile.socials.medium} target="_blank" rel="noopener noreferrer" className="text-[var(--theme-text)]/50 hover:text-[var(--theme-primary)] transition-colors">
                 <FaMedium size={18} />
               </a>
            )}
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[var(--theme-text)]/10 flex flex-col md:flex-row items-center justify-between text-xs text-[var(--theme-text)]/40 font-mono">
          <p>© {currentYear} All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/" className="hover:text-[var(--theme-text)] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[var(--theme-text)] transition-colors">About</Link>
            <Link href="/projects" className="hover:text-[var(--theme-text)] transition-colors">Projects</Link>
            <Link href="/contact" className="hover:text-[var(--theme-text)] transition-colors">Contact</Link>
            <Link href="/admin/login" className="hover:text-[var(--theme-text)] transition-colors ml-4 border-l border-[var(--theme-text)]/20 pl-4">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { FaExternalLinkAlt, FaArrowLeft, FaTimes } from "react-icons/fa";
import { resolveImageUrl } from "@/lib/image-utils";
import { Project } from "@/types/database";
import { useState } from "react";
import ImageModal from "@/components/ImageModal";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  allProjects?: Project[];
}

export default function ProjectDetailModal({ isOpen, onClose, project, allProjects = [] }: ProjectDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setModalImage(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [modalImage, setModalImage] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const heroImage = project.project_images && project.project_images.length > 0 ? project.project_images[0] : null;
  const galleryImages = project.project_images && project.project_images.length > 1 ? project.project_images.slice(1) : [];
  
  // Get up to 3 other projects
  const otherProjects = allProjects.filter(p => p.id !== project.id).slice(0, 3);

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[var(--theme-bg)] animate-in fade-in duration-300 overflow-y-auto">
        
        {/* Sticky Header for Action Buttons */}
        <div className="sticky top-0 left-0 right-0 z-[120] px-6 py-6 md:px-8 md:py-8 flex justify-between items-start pointer-events-none">
          {/* Back Button */}
          <button 
            onClick={onClose}
            className="pointer-events-auto group flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--theme-bg)]/90 backdrop-blur-xl border border-[var(--theme-text)]/10 text-[var(--theme-text)] hover:bg-[var(--theme-text)] hover:text-[var(--theme-bg)] transition-all shadow-xl font-bold"
          >
            <FaArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Back to Projects</span>
            <span className="inline sm:hidden">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 md:pb-12">


        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
          {project.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-[var(--theme-text)]/60 mb-12">
          {project.status && (
            <span className="px-3 py-1 rounded-full border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/5 text-xs font-medium">
              {project.status}
            </span>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="space-y-16">
            
            {/* Hero Image */}
            {heroImage && (
              <div className="rounded-2xl border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/5 overflow-hidden shadow-2xl">
                {/* Mac Window Header */}
                <div className="h-10 bg-[var(--theme-text)]/[0.03] border-b border-[var(--theme-text)]/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="relative aspect-[16/10] w-full">
                  <Image 
                    src={resolveImageUrl(heroImage.image_url)} 
                    alt={project.title} 
                    fill 
                    className="object-cover" 
                    priority
                  />
                </div>
              </div>
            )}

            {/* About the Project */}
            <div>
              <h2 className="text-2xl font-bold mb-6">About the Project</h2>
              <div className="text-[var(--theme-text)]/80 leading-relaxed space-y-4 whitespace-pre-wrap font-light">
                {project.description}
              </div>
            </div>

            {/* Project Gallery */}
            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                  {galleryImages.map((img: any, i: number) => (
                    <div 
                      key={img.id} 
                      className="relative rounded-xl overflow-hidden border border-[var(--theme-text)]/10 shadow-lg break-inside-avoid cursor-zoom-in group"
                      onClick={() => setModalImage(img.image_url)}
                    >
                      <img 
                        src={resolveImageUrl(img.image_url)} 
                        alt={`${project.title} gallery ${i + 1}`} 
                        className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white shadow-xl">
                          <FaExternalLinkAlt size={16} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Visit Live Site Button */}
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[var(--theme-text)] text-[var(--theme-bg)] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                <FaExternalLinkAlt size={14} /> Visit Live Site
              </a>
            )}

            {/* Technologies Used */}
            {project.tech_stack && (
              <div className="rounded-2xl border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.02] p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--theme-text)]/60">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.tech_stack.split(',').map((tech: string, i: number) => (
                    <span 
                      key={i} 
                      className="px-3.5 py-1.5 rounded-lg border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/5 text-sm font-medium text-[var(--theme-text)]/80"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div className="rounded-2xl border border-[var(--theme-text)]/10 bg-[var(--theme-text)]/[0.02] p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--theme-text)]/60">
                  Other Projects
                </h3>
                <div className="space-y-6">
                  {otherProjects.map((otherProj) => (
                    <div key={otherProj.id} className="group cursor-pointer">
                      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--theme-text)]/10 mb-3 relative">
                        {otherProj.project_images && otherProj.project_images.length > 0 ? (
                          <Image 
                            src={resolveImageUrl(otherProj.project_images[0].image_url)} 
                            alt={otherProj.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--theme-text)]/5 flex items-center justify-center text-xs text-[var(--theme-text)]/40">
                            No Image
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors line-clamp-1">
                        {otherProj.title}
                      </h4>
                      <p className="text-sm text-[var(--theme-text)]/60 line-clamp-2 mt-1">
                        {otherProj.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-[var(--theme-text)]/10">
                  <button 
                    onClick={onClose}
                    className="text-sm font-bold text-[var(--theme-text)] hover:text-[var(--theme-primary)] transition-colors w-full text-center"
                  >
                    View All Projects
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-[var(--theme-text)]/10 flex items-center justify-center text-xs text-[var(--theme-text)]/40 font-mono">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="h-20"></div>
      </div>
      </div>

      {modalImage && (
        <ImageModal 
          isOpen={true}
          onClose={() => setModalImage(null)}
          images={[modalImage]}
        />
      )}
    </>
  );
}

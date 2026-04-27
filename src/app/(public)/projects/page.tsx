"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { FaPlus, FaPlay, FaCodeBranch, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ScrollReveal from "@/components/ScrollReveal";
import { resolveImageUrl } from "@/lib/image-utils";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For managing image slider per project
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [modalState, setModalState] = useState<{ isOpen: boolean, images: string[], index: number }>({
    isOpen: false,
    images: [],
    index: 0
  });
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*, project_images(*)').order('order_index');
      if (data) {
        setProjects(data);
        const initialIndices: any = {};
        data.forEach(p => initialIndices[p.id] = 0);
        setCurrentImageIndex(initialIndices);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (projects.length === 0) return;

    const intervals = projects.map(project => {
      if (project.project_images && project.project_images.length > 1) {
        return setInterval(() => {
          nextImage(project.id, project.project_images.length);
        }, 5000); // Slide every 5 seconds
      }
      return null;
    });

    return () => {
      intervals.forEach(interval => interval && clearInterval(interval));
    };
  }, [projects]);

  const nextImage = (projectId: string, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: (prev[projectId] + 1) % maxImages
    }));
  };

  const prevImage = (projectId: string, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: (prev[projectId] - 1 + maxImages) % maxImages
    }));
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-[var(--theme-text)]/10 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-[var(--theme-primary)] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 bg-[var(--theme-text)]/5 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[var(--theme-primary)] rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-black tracking-[0.3em] uppercase text-[var(--theme-text)]/40 animate-pulse">Loading Experience</p>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]/70 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 space-y-24">
      <ScrollReveal direction="fade" duration={1000}>
        <div className="mb-12 border-b border-[var(--theme-text)]/10 pb-8 sm:pb-12 relative">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-4 sm:mb-6 relative z-10">
            Project Archive.
          </h1>
          <p className="text-[var(--theme-text)]/60 text-lg sm:text-xl max-w-2xl font-light">
            A comprehensive collection of my professional work, experiments, and open-source contributions.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project, index) => (
          <ScrollReveal key={project.id} direction="up" delay={100 * (index % 3)}>
            <div 
              className="group flex flex-col bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/10 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:border-[var(--theme-primary)]/30 transition-all duration-500 h-full relative cursor-pointer"
              onClick={() => {
                setSelectedProject(project);
                setDetailModalOpen(true);
              }}
            >
              
              {/* Image Showcase */}
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--theme-text)]/5">
                <div className="absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                
                {project.project_images && project.project_images.length > 0 ? (
                  <div className="relative w-full h-full">
                    {project.project_images.map((img: any, idx: number) => (
                      <div 
                        key={img.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          (currentImageIndex[project.id] || 0) === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        <Image
                          src={resolveImageUrl(img.image_url)}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--theme-text)]/5 text-[var(--theme-text)]/20 text-xs font-mono uppercase tracking-widest">
                    No Image
                  </div>
                )}

                {/* Indicators */}
                {project.project_images && project.project_images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                    {project.project_images.map((_: any, idx: number) => (
                      <div 
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          (currentImageIndex[project.id] || 0) === idx ? 'w-6 bg-[var(--theme-primary)]' : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                    <FaPlus size={20} />
                  </div>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="p-8 sm:p-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                   <h2 className="text-xl sm:text-2xl font-black group-hover:text-[var(--theme-primary)] transition-colors leading-tight min-h-[3rem] line-clamp-2" title={project.title}>
                     {project.title}
                   </h2>
                   <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 rounded-xl border border-[var(--theme-primary)]/20 shrink-0 ml-4 mt-1">
                     {project.status}
                   </span>
                </div>

                {/* Tech Tags on Card */}
                {project.tech_stack && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack.split(',').slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="text-[11px] font-bold text-[var(--theme-text)]/40 px-2.5 py-1 rounded-lg bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/5">
                        {tech.trim()}
                      </span>
                    ))}
                    {project.tech_stack.split(',').length > 3 && (
                      <span className="text-[11px] font-bold text-[var(--theme-text)]/20 flex items-center">+{project.tech_stack.split(',').length - 3} more</span>
                    )}
                  </div>
                )}
                
                <div className="relative flex-1 mb-8">
                  <p className="text-[var(--theme-text)]/60 text-base leading-relaxed font-light line-clamp-3">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-8 border-t border-[var(--theme-text)]/10 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[var(--theme-text)] text-[var(--theme-bg)] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-sm">
                    View Details
                  </button>
                  {(project.demo_url || project.repo_url) && (
                    <div className="flex gap-4">
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-4 rounded-2xl bg-[var(--theme-text)]/5 border border-[var(--theme-text)]/10 text-[var(--theme-text)] hover:bg-[var(--theme-primary)] hover:text-white transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaPlay size={12} />
                        </a>
                      )}
                      {project.repo_url && (
                        <a 
                          href={project.repo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-4 rounded-2xl bg-[var(--theme-text)]/5 border border-[var(--theme-text)]/10 text-[var(--theme-text)] hover:bg-[var(--theme-primary)] hover:text-white transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaCodeBranch size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ProjectDetailModal 
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        project={selectedProject}
        allProjects={projects}
      />
    </div>
  );
}

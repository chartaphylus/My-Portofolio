"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaArrowRight, FaCodeBranch, FaPlay, FaPlus } from "react-icons/fa";
import ScrollReveal from "@/components/ScrollReveal";
import OrbitGalaxy from "@/components/OrbitGalaxy";
import { resolveImageUrl } from "@/lib/image-utils";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean, images: string[], index: number }>({
    isOpen: false,
    images: [],
    index: 0
  });
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: profData },
          { data: projData }
        ] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('projects').select('*, project_images(*)').order('order_index').limit(4)
        ]);

        if (profData) setProfile(profData);
        if (projData) setProjects(projData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="max-w-6xl mx-auto px-6 space-y-40">
      
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center relative">
        <ScrollReveal direction="fade" duration={1000}>
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            
            <div className="flex-1 text-center md:text-left relative z-10 order-2 md:order-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--theme-text)]/[0.05] border border-[var(--theme-text)]/10 text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-6 sm:mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-pulse shadow-[0_0_10px_var(--theme-primary)]"></span> 
                {profile?.role || "Software Engineer"}
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 sm:mb-8 leading-[1.1] relative">
                <span className="absolute -left-4 md:-left-12 -top-8 sm:-top-12 text-[6rem] sm:text-[10rem] md:text-[15rem] font-black text-[var(--theme-text)]/[0.03] -z-10 leading-none select-none">
                  {(profile?.name || "M").charAt(0)}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-text)] via-[var(--theme-primary)] to-[var(--theme-text)] bg-[length:200%_auto] animate-gradient block">
                  {profile?.name || "M.K Bahtiar"}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-[var(--theme-text)]/60 max-w-2xl mb-8 sm:mb-12 leading-relaxed font-light mx-auto md:mx-0">
                {profile?.tagline || "I build high-performance web applications and digital experiences with a focus on clean code and pixel-perfect design."}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-6">
                <Link 
                  href="/about" 
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-[var(--theme-text)] text-[var(--theme-bg)] font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-105 shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-2 sm:gap-3">
                    About Me <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                {profile?.cv_url && (
                  <a 
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base border-2 border-[var(--theme-primary)]/50 text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white transition-all shadow-[0_0_15px_var(--theme-primary)] hover:shadow-[0_0_30px_var(--theme-primary)] shrink-0"
                  >
                    Download CV
                  </a>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 relative order-1 md:order-2">
              <OrbitGalaxy>
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full p-1.5 sm:p-2 border-2 sm:border-4 border-[var(--theme-text)]/10 bg-[var(--theme-bg)] shadow-2xl z-10 overflow-hidden">
                  {profile?.profile_image_url ? (
                    <Image
                      src={resolveImageUrl(profile.profile_image_url)}
                      alt={profile?.name || "Developer"}
                      fill
                      className="object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[var(--theme-text)]/10 flex items-center justify-center">
                      <span className="text-[var(--theme-text)]/40 font-bold text-2xl sm:text-4xl">{(profile?.name || "M").charAt(0)}</span>
                    </div>
                  )}
                </div>
              </OrbitGalaxy>
            </div>
            
          </div>
        </ScrollReveal>
      </section>

      {/* Featured Projects Grid */}
      <section>
        <ScrollReveal direction="up" delay={200}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-[var(--theme-text)]/10 pb-6 relative gap-6">
            <div className="absolute -bottom-px left-0 w-1/4 h-px bg-gradient-to-r from-[var(--theme-primary)] to-transparent"></div>
            <div>
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-4">Selected Work</h2>
               <p className="text-base sm:text-lg text-[var(--theme-text)]/60 font-light">Recent projects and technical accomplishments.</p>
            </div>
            <Link href="/projects" className="hidden sm:flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[var(--theme-primary)] hover:text-[var(--theme-text)] transition-colors">
              Explore All <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <div 
                key={index}
                className={`group relative flex flex-col rounded-3xl overflow-hidden ${index % 2 !== 0 ? 'md:mt-16' : ''}`}
              >
                {/* Image Showcase (Carousel Logic / Multiple Images Support) */}
                <div 
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--theme-text)]/5 rounded-3xl z-10 shadow-2xl cursor-pointer"
                  onClick={() => {
                    setSelectedProject(project);
                    setDetailModalOpen(true);
                  }}
                >
                  {/* Subtle noise over image */}
                  <div className="absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                  
                  {project.project_images && project.project_images.length > 0 ? (
                    <Image
                      src={resolveImageUrl(project.project_images[0].image_url)}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--theme-text)]/30">No Image</div>
                  )}
                  
                  {/* Glassmorphism Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-20"></div>
                  
                  {/* Hover Actions inside Image */}
                  <div className="absolute inset-0 flex items-center justify-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30">
                     <div className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <FaPlus size={24} />
                     </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="pt-8 pb-10 px-6 sm:px-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-2xl sm:text-3xl group-hover:text-[var(--theme-primary)] transition-colors leading-tight">{project.title}</h3>
                    <span className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 rounded-lg border border-[var(--theme-primary)]/20 shrink-0 ml-4">
                      {project.status}
                    </span>
                  </div>

                  {/* Tech Tags on Card */}
                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.split(',').slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold text-[var(--theme-text)]/40 px-2 py-1 rounded-md bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/5">
                          {tech.trim()}
                        </span>
                      ))}
                      {project.tech_stack.split(',').length > 3 && (
                        <span className="text-[10px] font-bold text-[var(--theme-text)]/20">+{project.tech_stack.split(',').length - 3}</span>
                      )}
                    </div>
                  )}
                  <p className="text-[var(--theme-text)]/60 text-base leading-relaxed line-clamp-3 font-light mb-8 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 mt-auto">
                    <button 
                      onClick={() => {
                        setSelectedProject(project);
                        setDetailModalOpen(true);
                      }}
                      className="text-xs font-bold uppercase tracking-widest text-[var(--theme-primary)] hover:text-[var(--theme-text)] transition-colors flex items-center gap-2 group/btn"
                    >
                      View Details <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    {(project.demo_url || project.repo_url) && (
                      <div className="flex items-center gap-4 ml-auto">
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[var(--theme-text)]/5 text-[var(--theme-text)]/40 hover:text-[var(--theme-primary)] transition-colors">
                            <FaPlay size={10} />
                          </a>
                        )}
                        {project.repo_url && (
                          <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[var(--theme-text)]/5 text-[var(--theme-text)]/40 hover:text-[var(--theme-primary)] transition-colors">
                            <FaCodeBranch size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex justify-center sm:hidden">
            <Link href="/projects" className="px-8 py-4 rounded-2xl font-bold border-2 border-[var(--theme-text)]/20 text-[var(--theme-text)] hover:bg-[var(--theme-text)]/5 transition-all flex items-center gap-3">
              View All Projects <FaArrowRight />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <ProjectDetailModal 
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        project={selectedProject}
        allProjects={projects}
      />
    </div>
  );
}
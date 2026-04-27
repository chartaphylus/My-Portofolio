"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { FaArrowRight, FaCode, FaPlus } from "react-icons/fa";
import ScrollReveal from "@/components/ScrollReveal";
import { resolveImageUrl } from "@/lib/image-utils";
import ImageModal from "@/components/ImageModal";

export default function About() {
  const [profile, setProfile] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean, image: string }>({
    isOpen: false,
    image: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: profData },
          { data: expData },
          { data: eduData },
          { data: skillData },
          { data: certData }
        ] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('experience').select('*').order('order_index'),
          supabase.from('education').select('*').order('order_index'),
          supabase.from('skills').select('*').order('order_index'),
          supabase.from('certifications').select('*').order('order_index')
        ]);

        if (profData) setProfile(profData);
        if (expData) setExperience(expData);
        if (eduData) setEducation(eduData);
        if (certData) setCertificates(certData);
        if (skillData) {
          const grouped = skillData.reduce((acc: any[], skill: any) => {
            const category = acc.find(c => c.title === skill.category);
            if (category) {
              category.skills.push(skill);
            } else {
              acc.push({ title: skill.category, skills: [skill] });
            }
            return acc;
          }, []);
          setSkills(grouped);
        }
      } catch (err) {
        console.error(err);
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
    <div className="max-w-5xl mx-auto px-6 pt-12 space-y-32">
      
      {/* Bio */}
      <section className="relative">
        <ScrollReveal direction="fade" duration={1000}>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
               <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-none">
                 Who<br/>Am I.
               </h1>
               <div className="text-[var(--theme-text)]/70 leading-relaxed space-y-6 text-lg sm:text-xl md:text-2xl font-light whitespace-pre-wrap">
                 {profile?.bio || "I am a software engineer."}
               </div>
            </div>
            <div className="lg:col-span-5 relative">
               <div className="aspect-[3/4] w-full max-w-md mx-auto bg-[var(--theme-text)]/5 rounded-3xl overflow-hidden border border-[var(--theme-text)]/10 shadow-2xl flex items-center justify-center">
                 {profile?.profile_image_url ? (
                   <Image 
                     src={resolveImageUrl(profile.profile_image_url)} 
                     alt={profile?.name || "Profile"} 
                     fill 
                     className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700" 
                   />
                 ) : (
                   <span className="text-[var(--theme-text)]/40 font-bold text-6xl">{(profile?.name || "M").charAt(0)}</span>
                 )}
               </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Experience */}
      <section>
        <ScrollReveal direction="up" delay={200}>
          <div className="flex items-center gap-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">Experience</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--theme-text)]/20 to-transparent"></div>
          </div>
          
          <div className="grid gap-16 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--theme-text)]/10 before:to-transparent">
            {experience.map((exp, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 border-[var(--theme-bg)] bg-[var(--theme-text)]/5 text-[var(--theme-primary)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10 overflow-hidden relative">
                   {exp.logo_url ? (
                     <Image src={resolveImageUrl(exp.logo_url)} alt={exp.company} fill className="object-cover" />
                   ) : (
                     <span className="font-bold">{exp.company.charAt(0)}</span>
                   )}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] sm:w-[calc(100%-5rem)] md:w-[calc(50%-4rem)] p-6 sm:p-8 rounded-3xl bg-[var(--theme-text)]/[0.02] border border-[var(--theme-text)]/10 hover:border-[var(--theme-primary)]/50 transition-colors shadow-xl">
                  <div className="text-[var(--theme-primary)] font-bold text-xs sm:text-sm tracking-widest uppercase mb-1 sm:mb-2">{exp.company}</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{exp.title}</h3>
                  <div className="text-[var(--theme-text)]/40 text-[10px] sm:text-xs font-mono mb-4 sm:mb-6">{exp.period} • {exp.type}</div>
                  <p className="text-[var(--theme-text)]/70 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-light">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Skills */}
      <section>
        <ScrollReveal direction="up" delay={200}>
          <div className="flex items-center gap-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">Skills</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--theme-text)]/20 to-transparent"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((category, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[var(--theme-text)]/[0.02] border border-[var(--theme-text)]/10 hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-xl font-bold tracking-tight text-[var(--theme-text)] mb-8 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)]"></span> {category.title}
                </h3>
                <div className="flex flex-col gap-4">
                  {category.skills.map((skill: any, j: number) => (
                    <div key={j} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-[var(--theme-text)]/5 flex items-center justify-center border border-[var(--theme-text)]/10 group-hover:border-[var(--theme-primary)]/50 transition-colors">
                        {skill.image_url ? (
                           <Image src={resolveImageUrl(skill.image_url)} alt={skill.name} width={20} height={20} className="object-contain" />
                        ) : (
                           <span className="w-2 h-2 rounded-full bg-[var(--theme-text)]/40"></span>
                        )}
                      </div>
                      <span className="font-medium text-[var(--theme-text)]/80 group-hover:text-[var(--theme-primary)] transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Education & Certifications */}
      <section className="space-y-32">
        <ScrollReveal direction="up" delay={200}>
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Education</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--theme-text)]/20 to-transparent"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-[var(--theme-text)]/[0.02] border border-[var(--theme-text)]/10 hover:border-[var(--theme-primary)]/50 transition-colors shadow-xl flex flex-col md:flex-row gap-6 items-start">
                {edu.logo_url && (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-full overflow-hidden shrink-0 bg-[var(--theme-bg)] border border-[var(--theme-text)]/10 shadow-sm">
                    <Image src={resolveImageUrl(edu.logo_url)} alt={edu.school} fill className="object-cover rounded-full" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--theme-primary)] font-bold text-xs sm:text-sm tracking-widest uppercase mb-1 sm:mb-2">{edu.school}</div>
                  <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 leading-snug">{edu.degree}</h3>
                  <div className="text-[var(--theme-text)]/40 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4">{edu.period} • {edu.location}</div>
                  <p className="text-[var(--theme-text)]/70 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-light">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Certifications</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--theme-text)]/20 to-transparent"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {certificates.map((cert, i) => (
              <div key={i} className="group p-6 sm:p-8 rounded-[2.5rem] bg-[var(--theme-text)]/[0.03] border border-[var(--theme-text)]/10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                 {cert.image_url ? (
                   <div 
                     className="w-full sm:w-48 h-48 sm:h-32 relative rounded-2xl overflow-hidden bg-white shrink-0 shadow-sm border border-black/5 cursor-zoom-in group-hover:shadow-md transition-shadow"
                     onClick={() => setModalState({ isOpen: true, image: cert.image_url })}
                   >
                     <Image src={resolveImageUrl(cert.image_url)} alt={cert.title} fill className="object-cover sm:object-contain p-1" />
                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <FaPlus className="text-black/50 scale-50 group-hover:scale-100 transition-transform" size={24} />
                     </div>
                   </div>
                 ) : (
                   <div className="w-full sm:w-48 h-48 sm:h-32 rounded-2xl bg-[var(--theme-text)]/5 shrink-0 flex items-center justify-center border border-[var(--theme-text)]/10">
                     <span className="text-[var(--theme-primary)] font-bold text-2xl">#</span>
                   </div>
                 )}
                 
                 <div className="flex-1 w-full text-left">
                   <h3 className="font-extrabold text-xl sm:text-2xl leading-tight mb-1 group-hover:text-[var(--theme-primary)] transition-colors">{cert.title}</h3>
                   <p className="text-sm sm:text-base text-[var(--theme-text)]/50 mb-5 font-medium">{cert.issuer}</p>
                   
                   <div className="flex flex-col gap-2.5 mb-6">
                     <span className="px-4 py-1.5 text-[10px] sm:text-xs tracking-widest font-mono bg-[var(--theme-text)]/[0.04] text-[var(--theme-text)]/60 rounded-full border border-[var(--theme-text)]/10 w-fit uppercase">
                       Issued: {cert.issue_date}
                     </span>
                     {cert.expiry_date && (
                       <span className="px-4 py-1.5 text-[10px] sm:text-xs tracking-widest font-mono bg-[var(--theme-text)]/[0.04] text-[var(--theme-text)]/60 rounded-full border border-[var(--theme-text)]/10 w-fit uppercase">
                         Expires: {cert.expiry_date}
                       </span>
                     )}
                   </div>

                   {cert.credential_url && (
                     <a 
                       href={cert.credential_url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 text-sm font-bold text-[var(--theme-primary)] hover:underline"
                     >
                       Show Credential <span className="text-xs">↗</span>
                     </a>
                   )}
                 </div>
              </div>
            ))}
          </div>

        </ScrollReveal>
      </section>

      <ImageModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        images={[modalState.image]}
      />
    </div>
  );
}

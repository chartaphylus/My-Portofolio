"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaMedium, FaArrowRight } from "react-icons/fa";
import ScrollReveal from "@/components/ScrollReveal";

export default function Contact() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
      
      setSubmitStatus({ type: 'success', text: 'Message sent successfully! I will get back to you soon.' });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setSubmitStatus({ type: 'error', text: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
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
    <div className="max-w-6xl mx-auto px-6 pt-12">
      
      <ScrollReveal direction="fade" duration={1000}>
        <div className="mb-16 sm:mb-24 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-none">
            Let's build<br/>something <span className="text-[var(--theme-primary)]">great.</span>
          </h1>
          <p className="text-[var(--theme-text)]/60 text-lg sm:text-xl font-light px-4 sm:px-0">
            Interested in collaborating, have a question, or just want to say hi? Feel free to reach out. I'm always open to discussing new opportunities.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={200}>
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/40 mb-8 flex items-center gap-4">
                <span className="w-8 h-px bg-[var(--theme-text)]/20"></span> Connect
              </h2>
              <div className="space-y-8">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-4 sm:gap-6 group">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--theme-text)]/5 border border-[var(--theme-text)]/10 group-hover:bg-[var(--theme-primary)] group-hover:border-[var(--theme-primary)] transition-all duration-300 shadow-xl shrink-0">
                      <FaEnvelope size={18} className="text-[var(--theme-text)] group-hover:text-white transition-colors sm:text-[20px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-[var(--theme-text)]/40 mb-0.5 sm:mb-1 font-mono">Email</div>
                      <div className="text-lg sm:text-xl font-bold group-hover:text-[var(--theme-primary)] transition-colors truncate">{profile.email}</div>
                    </div>
                  </a>
                )}

                {profile?.phone && (
                  <div className="flex items-center gap-4 sm:gap-6 group cursor-default">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--theme-text)]/5 border border-[var(--theme-text)]/10 transition-all duration-300 shadow-xl shrink-0">
                      <FaPhoneAlt size={18} className="text-[var(--theme-text)] sm:text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[var(--theme-text)]/40 mb-0.5 sm:mb-1 font-mono">Phone</div>
                      <div className="text-lg sm:text-xl font-bold">{profile.phone}</div>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-center gap-4 sm:gap-6 group cursor-default">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--theme-text)]/5 border border-[var(--theme-text)]/10 transition-all duration-300 shadow-xl shrink-0">
                      <FaMapMarkerAlt size={18} className="text-[var(--theme-text)] sm:text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[var(--theme-text)]/40 mb-0.5 sm:mb-1 font-mono">Location</div>
                      <div className="text-lg sm:text-xl font-bold">{profile.location}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {profile?.socials && Object.keys(profile.socials).length > 0 && (
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-text)]/40 mb-8 flex items-center gap-4">
                   <span className="w-8 h-px bg-[var(--theme-text)]/20"></span> Socials
                 </h2>
                 <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                   {profile.socials.github && (
                     <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="shrink-0 snap-start p-3 sm:p-4 bg-[var(--theme-text)]/5 rounded-xl sm:rounded-2xl border border-[var(--theme-text)]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:bg-[#333] hover:text-white hover:border-[#333]">
                       <FaGithub size={20} className="sm:w-6 sm:h-6" />
                     </a>
                   )}
                   {profile.socials.linkedin && (
                     <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="shrink-0 snap-start p-3 sm:p-4 bg-[var(--theme-text)]/5 rounded-xl sm:rounded-2xl border border-[var(--theme-text)]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]">
                       <FaLinkedin size={20} className="sm:w-6 sm:h-6" />
                     </a>
                   )}
                   {profile.socials.instagram && (
                     <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="shrink-0 snap-start p-3 sm:p-4 bg-[var(--theme-text)]/5 rounded-xl sm:rounded-2xl border border-[var(--theme-text)]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]">
                       <FaInstagram size={20} className="sm:w-6 sm:h-6" />
                     </a>
                   )}
                   {profile.socials.facebook && (
                     <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer" className="shrink-0 snap-start p-3 sm:p-4 bg-[var(--theme-text)]/5 rounded-xl sm:rounded-2xl border border-[var(--theme-text)]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]">
                       <FaFacebook size={20} className="sm:w-6 sm:h-6" />
                     </a>
                   )}
                   {profile.socials.medium && (
                     <a href={profile.socials.medium} target="_blank" rel="noopener noreferrer" className="shrink-0 snap-start p-3 sm:p-4 bg-[var(--theme-text)]/5 rounded-xl sm:rounded-2xl border border-[var(--theme-text)]/10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:bg-black hover:text-white hover:border-black">
                       <FaMedium size={20} className="sm:w-6 sm:h-6" />
                     </a>
                   )}
                 </div>
              </div>
            )}
          </div>

          {/* Contact Form Placeholder */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--theme-text)]/[0.02] border border-[var(--theme-text)]/10 p-8 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex flex-col justify-center">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--theme-primary)]/10 rounded-full blur-[80px] -z-10 mix-blend-screen pointer-events-none"></div>
               
               {submitStatus?.type === 'success' ? (
                 <div className="text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                       <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                       </svg>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4">Message Sent!</h2>
                    <p className="text-[var(--theme-text)]/60 text-lg mb-8 max-w-sm mx-auto">
                      Thank you for reaching out. I've received your inquiry and will get back to you as soon as possible.
                    </p>
                    <button 
                      onClick={() => setSubmitStatus(null)}
                      className="text-sm font-bold uppercase tracking-widest text-[var(--theme-primary)] hover:opacity-70 transition-opacity"
                    >
                      Send another message
                    </button>
                 </div>
               ) : (
                 <>
                   <h2 className="text-3xl font-extrabold tracking-tight mb-10">Send a message</h2>
                   
                   {submitStatus?.type === 'error' && (
                     <div className="p-4 mb-8 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 text-sm font-semibold backdrop-blur-md flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                       {submitStatus.text}
                     </div>
                   )}

                   <form className="space-y-8" onSubmit={handleSubmit}>
                      <div className="relative group">
                        <input type="text" id="name" required value={name} onChange={e=>setName(e.target.value)} className="block w-full px-0 py-4 text-lg bg-transparent border-0 border-b-2 border-[var(--theme-text)]/20 appearance-none focus:outline-none focus:ring-0 focus:border-[var(--theme-primary)] peer transition-colors" placeholder=" " />
                        <label htmlFor="name" className="absolute text-lg text-[var(--theme-text)]/50 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[var(--theme-primary)] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">What's your name?</label>
                      </div>
                      <div className="relative group">
                        <input type="email" id="email" required value={email} onChange={e=>setEmail(e.target.value)} className="block w-full px-0 py-4 text-lg bg-transparent border-0 border-b-2 border-[var(--theme-text)]/20 appearance-none focus:outline-none focus:ring-0 focus:border-[var(--theme-primary)] peer transition-colors" placeholder=" " />
                        <label htmlFor="email" className="absolute text-lg text-[var(--theme-text)]/50 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[var(--theme-primary)] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">What's your email?</label>
                      </div>
                      <div className="relative group">
                        <textarea id="message" required rows={4} value={message} onChange={e=>setMessage(e.target.value)} className="block w-full px-0 py-4 text-lg bg-transparent border-0 border-b-2 border-[var(--theme-text)]/20 appearance-none focus:outline-none focus:ring-0 focus:border-[var(--theme-primary)] peer transition-colors resize-none" placeholder=" "></textarea>
                        <label htmlFor="message" className="absolute text-lg text-[var(--theme-text)]/50 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[var(--theme-primary)] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tell me about your project...</label>
                      </div>
                      <button type="submit" disabled={submitting} className="group flex items-center justify-between w-full p-6 mt-12 bg-[var(--theme-text)] text-[var(--theme-bg)] font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100">
                        <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                        {!submitting && <FaArrowRight className="group-hover:translate-x-2 transition-transform" />}
                      </button>
                   </form>
                 </>
               )}
            </div>
          </div>

        </div>
      </ScrollReveal>

    </div>
  );
}

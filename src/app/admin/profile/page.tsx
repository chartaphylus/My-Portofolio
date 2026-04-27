"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Profile } from "@/types/database";
import Image from "next/image";
import { uploadFile, deleteFileFromUrl } from "@/lib/storage";
import { useNotification } from "@/components/NotificationContext";
import { resolveImageUrl } from "@/lib/image-utils";

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useNotification();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').single();
    if (data) {
      setProfile(data);
      setImagePreview(data.profile_image_url);
      if (data.cv_url) setCvName("Current CV Linked");
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvName(file.name);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    try {
      let finalImageUrl = profile.profile_image_url;
      let finalCvUrl = profile.cv_url;

      if (imageFile) {
        const uploadedImg = await uploadFile(imageFile, 'profile');
        if (uploadedImg) {
          if (profile.profile_image_url) await deleteFileFromUrl(profile.profile_image_url);
          finalImageUrl = uploadedImg;
        }
      }

      if (cvFile) {
         const uploadedCv = await uploadFile(cvFile, 'cv');
         if (uploadedCv) {
           if (profile.cv_url) await deleteFileFromUrl(profile.cv_url);
           finalCvUrl = uploadedCv;
         }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          role: profile.role,
          tagline: profile.tagline,
          bio: profile.bio,
          profile_image_url: finalImageUrl,
          cv_url: finalCvUrl,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          socials: profile.socials || {},
        })
        .eq('id', profile.id);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Profile updated successfully", "success");
        setProfile({ ...profile, profile_image_url: finalImageUrl, cv_url: finalCvUrl });
        setImageFile(null);
        setCvFile(null);
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-cyan-400/50 transition-all backdrop-blur-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

  if (loading) return (
    <div className="pt-10">
       <span className="text-sm font-medium text-gray-500">Loading profile data...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <AdminPageHeader 
        title="Profile Settings" 
        description="Manage your biographical information, contact details, and media assets." 
      />


      <form onSubmit={handleUpdate} className="space-y-12">
        
        {/* --- Profile Information --- */}
        <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-white/10">
           <div className="w-full md:w-1/3 pt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Identity</h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                Update your primary biographical details. This information will be displayed prominently on your portfolio's main hero section to introduce who you are to visitors.
              </p>
           </div>
           
           <div className="w-full md:w-2/3">
              <div className="p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] backdrop-blur-xl space-y-6 relative overflow-hidden group">
                 {/* Decorative background glow */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className={labelClass}>Full Name</label>
                      <input type="text" required value={profile?.name || ''} onChange={e => setProfile({...profile!, name: e.target.value})} className={inputClass} placeholder="e.g. John Doe" />
                   </div>
                   <div>
                      <label className={labelClass}>Professional Role</label>
                      <input type="text" required value={profile?.role || ''} onChange={e => setProfile({...profile!, role: e.target.value})} className={inputClass} placeholder="e.g. Software Engineer" />
                   </div>
                 </div>
                 
                 <div>
                    <label className={labelClass}>Tagline</label>
                    <input type="text" required value={profile?.tagline || ''} onChange={e => setProfile({...profile!, tagline: e.target.value})} className={inputClass} placeholder="A short, catchy phrase about what you do" />
                 </div>
                 
                 <div>
                    <label className={labelClass}>Biography</label>
                    <textarea required rows={8} value={profile?.bio || ''} onChange={e => setProfile({...profile!, bio: e.target.value})} className={`${inputClass} resize-none`} placeholder="Tell your story, your passion, and what makes you unique..."></textarea>
                 </div>
              </div>
           </div>
        </div>

        {/* --- Contact Details --- */}
        <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-white/10">
           <div className="w-full md:w-1/3 pt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Info & Socials</h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                Define how recruiters or clients can reach out to you, and provide links to your professional social media accounts.
              </p>
           </div>
           
           <div className="w-full md:w-2/3">
              <div className="p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] backdrop-blur-xl space-y-6 relative overflow-hidden group">
                 {/* Decorative background glow */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-purple-500/10 transition-colors duration-500"></div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" required value={profile?.email || ''} onChange={e => setProfile({...profile!, email: e.target.value})} className={inputClass} placeholder="hello@example.com" />
                   </div>
                   <div>
                      <label className={labelClass}>Phone Number</label>
                      <input type="text" value={profile?.phone || ''} onChange={e => setProfile({...profile!, phone: e.target.value})} className={inputClass} placeholder="+62 812 3456 7890" />
                   </div>
                   <div>
                      <label className={labelClass}>Location</label>
                      <input type="text" required value={profile?.location || ''} onChange={e => setProfile({...profile!, location: e.target.value})} className={inputClass} placeholder="e.g. Jakarta, Indonesia" />
                   </div>
                 </div>

                 <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Social Media Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className={labelClass}>LinkedIn URL</label>
                         <input type="url" value={profile?.socials?.linkedin || ''} onChange={e => setProfile({...profile!, socials: {...(profile?.socials || {}), linkedin: e.target.value}})} className={inputClass} placeholder="https://linkedin.com/in/username" />
                      </div>
                      <div>
                         <label className={labelClass}>GitHub URL</label>
                         <input type="url" value={profile?.socials?.github || ''} onChange={e => setProfile({...profile!, socials: {...(profile?.socials || {}), github: e.target.value}})} className={inputClass} placeholder="https://github.com/username" />
                      </div>
                      <div>
                         <label className={labelClass}>Instagram URL</label>
                         <input type="url" value={profile?.socials?.instagram || ''} onChange={e => setProfile({...profile!, socials: {...(profile?.socials || {}), instagram: e.target.value}})} className={inputClass} placeholder="https://instagram.com/username" />
                      </div>
                      <div>
                         <label className={labelClass}>Facebook URL</label>
                         <input type="url" value={profile?.socials?.facebook || ''} onChange={e => setProfile({...profile!, socials: {...(profile?.socials || {}), facebook: e.target.value}})} className={inputClass} placeholder="https://facebook.com/username" />
                      </div>
                      <div>
                         <label className={labelClass}>Medium URL</label>
                         <input type="url" value={profile?.socials?.medium || ''} onChange={e => setProfile({...profile!, socials: {...(profile?.socials || {}), medium: e.target.value}})} className={inputClass} placeholder="https://medium.com/@username" />
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- Media Assets --- */}
        <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-white/10">
           <div className="w-full md:w-1/3 pt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Media Assets</h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                Manage your display picture and downloadable resume (CV). Keep your photo professional and ensure your CV is up-to-date with your latest achievements.
              </p>
           </div>
           
           <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-6">
              {/* Profile Photo Upload */}
              <div className="flex-1 p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] backdrop-blur-xl flex flex-col items-center text-center">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 w-full text-left">Profile Photo</h4>
                
                <div className="relative w-36 h-36 mb-8 rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-2xl bg-gray-100 dark:bg-black/50 group/img cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                  {imagePreview ? (
                    <Image src={resolveImageUrl(imagePreview)} alt="Profile" fill className="object-cover group-hover/img:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white text-xs font-semibold tracking-wider">CHANGE</span>
                  </div>
                </div>
                
                <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
                <button type="button" onClick={() => imageInputRef.current?.click()} className="text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md transition-all backdrop-blur-sm w-full">
                  Browse Photo
                </button>
              </div>

              {/* CV Upload */}
              <div className="flex-1 p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] backdrop-blur-xl flex flex-col">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Curriculum Vitae (PDF)</h4>
                
                <input type="file" accept=".pdf" ref={cvInputRef} onChange={handleCvChange} className="hidden" />
                
                {profile?.cv_url && !cvFile ? (
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div className="flex flex-col items-center justify-center flex-1 p-6 border border-cyan-500/20 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 backdrop-blur-sm shadow-inner group/cv relative overflow-hidden">
                      {/* Decorative PDF Icon */}
                      <div className="w-12 h-12 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl mb-3 group-hover/cv:scale-110 group-hover/cv:rotate-3 transition-transform duration-300">
                        📄
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center px-4">
                         Current CV Active
                      </span>
                      <a href={profile.cv_url} target="_blank" rel="noreferrer" className="mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors hover:underline">
                         Preview Document
                      </a>
                    </div>
                    <button type="button" onClick={() => cvInputRef.current?.click()} className="text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md transition-all backdrop-blur-sm w-full">
                       Replace File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div 
                      onClick={() => cvInputRef.current?.click()}
                      className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-white/30 dark:bg-black/20 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl cursor-pointer hover:bg-cyan-500/5 dark:hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all group"
                    >
                       <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all">
                         <span className="text-gray-400 group-hover:text-cyan-400">↑</span>
                       </div>
                       <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center mb-2 px-2 break-all line-clamp-2">
                         {cvName || "Select PDF Document"}
                       </span>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* --- Form Actions --- */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-4">
           {saving && (
             <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
               <span className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></span>
               Synchronizing changes...
             </div>
           )}
           <button 
             type="submit" 
             disabled={saving}
             className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
           >
             {saving ? "Saving Updates" : "Save Changes"}
           </button>
        </div>

      </form>
    </div>
  );
}

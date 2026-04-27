"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { SiteSettings } from "@/types/database";
import Image from "next/image";
import { uploadFile, deleteFileFromUrl } from "@/lib/storage";
import { useNotification } from "@/components/NotificationContext";
import { resolveImageUrl } from "@/lib/image-utils";
import { FaPaintBrush } from "react-icons/fa";

export default function AdminAppearance() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useNotification();

  const [loginBgFile, setLoginBgFile] = useState<File | null>(null);
  const [loginBgPreview, setLoginBgPreview] = useState<string | null>(null);
  const loginBgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
    if (data) {
      setSettings(data);
      setLoginBgPreview(data.login_bg_url || null);
    } else {
      setSettings({ 
        id: 'default',
        light_bg_color: '#ffffff',
        light_text_color: '#000000',
        light_primary_color: '#0ea5e9',
        dark_bg_color: '#0a0a0a',
        dark_text_color: '#ffffff',
        dark_primary_color: '#22d3ee'
      } as SiteSettings);
    }
    setLoading(false);
  };

  const handleLoginBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoginBgFile(file);
      setLoginBgPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    try {
      let finalLoginBgUrl = settings.login_bg_url;

      if (loginBgFile) {
        const uploadedBg = await uploadFile(loginBgFile, 'settings');
        if (uploadedBg) {
          if (settings.login_bg_url) await deleteFileFromUrl(settings.login_bg_url);
          finalLoginBgUrl = uploadedBg;
        }
      }

      // Upsert into site_settings (assuming id is "default" if it's new)
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: settings.id,
          login_bg_url: finalLoginBgUrl,
          light_bg_color: settings.light_bg_color,
          light_text_color: settings.light_text_color,
          light_primary_color: settings.light_primary_color,
          dark_bg_color: settings.dark_bg_color,
          dark_text_color: settings.dark_text_color,
          dark_primary_color: settings.dark_primary_color,
        });

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Appearance settings updated", "success");
        setSettings({ ...settings, login_bg_url: finalLoginBgUrl });
        setLoginBgFile(null);
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="pt-10">
       <span className="text-sm font-medium text-gray-500">Loading appearance data...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <AdminPageHeader 
        title="Appearance Settings" 
        description="Customize the visual look of your private workspaces, including the login gate background." 
      />


      <form onSubmit={handleUpdate} className="space-y-12">
        
        {/* --- Login Screen Styling --- */}
        <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-white/10">
           <div className="w-full md:w-1/3 pt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaPaintBrush className="text-cyan-500" /> Login Screen
              </h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                Personalize the background image of your secure login portal. We recommend a wide landscape or abstract dark image for the best frosted-glass effect.
              </p>
           </div>
           
           <div className="w-full md:w-2/3">
              <div className="p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.01)] backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 w-full text-left">Login Background</h4>
                
                <div className="relative w-full h-48 md:h-64 mb-8 rounded-2xl overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-2xl bg-gray-100 dark:bg-black/50 group/img cursor-pointer" onClick={() => loginBgInputRef.current?.click()}>
                  {loginBgPreview ? (
                    <Image src={resolveImageUrl(loginBgPreview)} alt="Login Background" fill className="object-cover group-hover/img:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400">No Image Uploaded</div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white text-xs font-semibold tracking-wider">CHANGE IMAGE</span>
                  </div>
                </div>
                
                <input type="file" accept="image/*" ref={loginBgInputRef} onChange={handleLoginBgChange} className="hidden" />
                
                <div className="flex gap-4 w-full">
                  <button type="button" onClick={() => loginBgInputRef.current?.click()} className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md transition-all backdrop-blur-sm">
                    Browse File
                  </button>
                  {loginBgPreview && (
                    <a href="/admin/login" target="_blank" rel="noreferrer" className="flex-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-6 py-3 rounded-xl hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2">
                      Preview Login
                    </a>
                  )}
                </div>
              </div>
           </div>
        </div>

        {/* --- Theme Colors --- */}
        <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-white/10">
           <div className="w-full md:w-1/3 pt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"></span> Theme Colors
              </h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                Define the color palette for your public portfolio. These colors dynamically control the "Clean Tech" design aesthetics for both Light and Dark modes.
              </p>
           </div>
           
           <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Light Mode Colors */}
              <div className="p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-lg backdrop-blur-xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-[40px] -z-10"></div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  ☀️ Light Mode
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Background Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings?.light_bg_color || '#ffffff'} onChange={(e) => setSettings({...settings!, light_bg_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <input type="text" value={settings?.light_bg_color || '#ffffff'} onChange={(e) => setSettings({...settings!, light_bg_color: e.target.value})} className="flex-1 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Text Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings?.light_text_color || '#000000'} onChange={(e) => setSettings({...settings!, light_text_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <input type="text" value={settings?.light_text_color || '#000000'} onChange={(e) => setSettings({...settings!, light_text_color: e.target.value})} className="flex-1 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Primary Color (Accents)</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings?.light_primary_color || '#0ea5e9'} onChange={(e) => setSettings({...settings!, light_primary_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <input type="text" value={settings?.light_primary_color || '#0ea5e9'} onChange={(e) => setSettings({...settings!, light_primary_color: e.target.value})} className="flex-1 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark Mode Colors */}
              <div className="p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-lg backdrop-blur-xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] -z-10"></div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  🌙 Dark Mode
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Background Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings?.dark_bg_color || '#0a0a0a'} onChange={(e) => setSettings({...settings!, dark_bg_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <input type="text" value={settings?.dark_bg_color || '#0a0a0a'} onChange={(e) => setSettings({...settings!, dark_bg_color: e.target.value})} className="flex-1 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Text Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings?.dark_text_color || '#ffffff'} onChange={(e) => setSettings({...settings!, dark_text_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <input type="text" value={settings?.dark_text_color || '#ffffff'} onChange={(e) => setSettings({...settings!, dark_text_color: e.target.value})} className="flex-1 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Primary Color (Accents)</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings?.dark_primary_color || '#22d3ee'} onChange={(e) => setSettings({...settings!, dark_primary_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <input type="text" value={settings?.dark_primary_color || '#22d3ee'} onChange={(e) => setSettings({...settings!, dark_primary_color: e.target.value})} className="flex-1 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* --- Form Actions --- */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-4">
           {saving && (
             <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
               <span className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></span>
               Applying appearance...
             </div>
           )}
           <button 
             type="submit" 
             disabled={saving}
             className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
           >
             {saving ? "Saving Updates" : "Save Changes"}
           </button>
        </div>

      </form>
    </div>
  );
}

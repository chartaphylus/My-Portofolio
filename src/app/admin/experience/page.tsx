"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Experience } from "@/types/database";
import Image from "next/image";
import { uploadFile, deleteFileFromUrl } from "@/lib/storage";
import { useNotification } from "@/components/NotificationContext";
import { resolveImageUrl } from "@/lib/image-utils";

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast, confirmAction } = useNotification();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Full time",
    period: "",
    status: "Active",
    status_color: "from-blue-500 to-indigo-500", // We might not use this visually in a minimalist theme, but keep for data structure
    description: "",
    work_model: "On-site"
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('experience').select('*').order('order_index');
    if (data) setItems(data);
    setLoading(false);
  };

  const handleOpenDrawer = (item: Experience | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        company: item.company,
        type: item.type || "Full time",
        period: item.period || "",
        status: item.status || "Active",
        status_color: item.status_color || "",
        description: item.description || "",
        work_model: item.work_model || "On-site"
      });
      setLogoPreview(item.logo_url || null);
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        company: "",
        type: "Full time",
        period: "",
        status: "Active",
        status_color: "",
        description: "",
        work_model: "On-site"
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingItem(null);
      setLogoFile(null);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      let finalLogoUrl = editingItem?.logo_url || null;

      if (logoFile) {
         const uploaded = await uploadFile(logoFile, 'experience');
         if (uploaded) {
           if (editingItem?.logo_url) await deleteFileFromUrl(editingItem.logo_url);
           finalLogoUrl = uploaded;
         }
      }

      const payload = { ...formData, logo_url: finalLogoUrl };

      if (editingItem) {
        await supabase.from('experience').update(payload).eq('id', editingItem.id);
      } else {
        await supabase.from('experience').insert(payload);
      }

      await fetchItems();
      showToast(editingItem ? "Record updated" : "Record added", "success");
      closeDrawer();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred while saving.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (item: Experience) => {
    confirmAction({
      title: "Remove Experience?",
      message: `Are you sure you want to remove the record for "${item.title}"?`,
      type: "danger",
      onConfirm: async () => {
        if (item.logo_url) await deleteFileFromUrl(item.logo_url);
        await supabase.from('experience').delete().eq('id', item.id);
        fetchItems();
        showToast("Record removed successfully", "success");
      }
    });
  };

  const inputClass = "w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#333] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  if (loading) return (
    <div className="pt-10">
       <span className="text-sm font-medium text-gray-500">Loading experience data...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <AdminPageHeader 
        title="Experience" 
        description="Your chronological work history and professional roles." 
        action={
          <button 
            onClick={() => handleOpenDrawer()}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Add Role
          </button>
        }
      />

      <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-[#1F1F1F]">
          {items.map((item) => (
            <li key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50 dark:hover:bg-[#111] transition-colors">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-white dark:bg-black border border-gray-200 dark:border-[#333] rounded-md flex items-center justify-center overflow-hidden shrink-0">
                  {item.logo_url ? (
                    <Image src={resolveImageUrl(item.logo_url)} alt={item.company} width={30} height={30} className="object-contain" />
                  ) : (
                    <span className="text-xs text-gray-400">Logo</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                     {item.title}
                     <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-gray-200 dark:border-[#333] text-gray-500 dark:text-gray-400">
                       {item.status}
                     </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                     {item.period} &middot; {item.type} {item.work_model ? `· ${item.work_model}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <button onClick={() => handleOpenDrawer(item)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Edit
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-[#333]"></div>
                <button onClick={() => handleDelete(item)} className="text-sm font-medium text-red-600 dark:text-red-500 hover:opacity-80">
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-8 text-center text-sm text-gray-500">No experience records.</li>
          )}
        </ul>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDrawer}></div>
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0A0A0A] border-l border-gray-200 dark:border-[#1F1F1F] animate-in slide-in-from-right duration-500 flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1F1F1F] flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {editingItem ? "Edit Role" : "Add Role"}
              </h2>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-black dark:hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex flex-col mb-4">
                 <label className={labelClass}>Company Logo</label>
                 <div className="flex items-center gap-4 mt-2">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-md flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <Image src={resolveImageUrl(logoPreview)} alt="Company Logo" width={40} height={40} className="object-contain" />
                      ) : (
                        <span className="text-[10px] text-gray-400">None</span>
                      )}
                   </div>
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-black dark:text-white bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#2A2A2A]">
                     Choose File
                   </button>
                   <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
                 </div>
              </div>

              <form id="exp-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} />
                </div>
                
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contract Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={inputClass}>
                      <option>Full time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Part time</option>
                      <option>Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Work Setting</label>
                    <select value={formData.work_model} onChange={e => setFormData({...formData, work_model: e.target.value})} className={inputClass}>
                      <option>On-site</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Time Period</label>
                    <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className={inputClass} placeholder="e.g. Jan 2023 - Present" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Status Badge</label>
                  <input type="text" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={inputClass} placeholder="e.g. Active" />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass} resize-none`}></textarea>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-[#1F1F1F] flex gap-3 bg-gray-50 dark:bg-[#111]">
              <button type="button" onClick={closeDrawer} className="px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-[#222]">
                Cancel
              </button>
              <button type="submit" form="exp-form" disabled={saveLoading} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-medium text-sm py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

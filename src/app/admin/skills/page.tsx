"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Skill } from "@/types/database";
import Image from "next/image";
import { uploadFile, deleteFileFromUrl } from "@/lib/storage";
import { useNotification } from "@/components/NotificationContext";
import { resolveImageUrl } from "@/lib/image-utils";
import { FaCode } from "react-icons/fa";

export default function AdminSkills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast, confirmAction } = useNotification();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: "Intermediate"
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('category').order('order_index');
    if (data) setItems(data);
    setLoading(false);
  };

  const categories = Array.from(new Set(items.map(item => item.category)));

  const handleOpenDrawer = (item: Skill | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        level: item.level || "Intermediate"
      });
      setImagePreview(item.image_url || null);
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: "Frontend",
        level: "Intermediate"
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingItem(null);
      setImageFile(null);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      let finalImageUrl = editingItem?.image_url || null;

      if (imageFile) {
         const uploaded = await uploadFile(imageFile, 'skills');
         if (uploaded) {
           if (editingItem?.image_url && !editingItem.image_url.includes('cdn.jsdelivr.net')) await deleteFileFromUrl(editingItem.image_url);
           finalImageUrl = uploaded;
         }
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (editingItem) {
        await supabase.from('skills').update(payload).eq('id', editingItem.id);
      } else {
        await supabase.from('skills').insert(payload);
      }

      await fetchItems();
      showToast(editingItem ? "Skill updated" : "Skill added", "success");
      closeDrawer();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred while saving.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (item: Skill) => {
    confirmAction({
      title: "Remove Skill?",
      message: `Are you sure you want to remove "${item.name}"?`,
      type: "danger",
      onConfirm: async () => {
        if (item.image_url && !item.image_url.includes('cdn.jsdelivr.net')) await deleteFileFromUrl(item.image_url);
        await supabase.from('skills').delete().eq('id', item.id);
        fetchItems();
        showToast("Skill removed successfully", "success");
      }
    });
  };

  const inputClass = "w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#333] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  if (loading) return (
    <div className="pt-10">
       <span className="text-sm font-medium text-gray-500">Loading skills data...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <AdminPageHeader 
        title="Skills & Technologies" 
        description="Technical proficiencies and tools categorized by domain." 
        action={
          <button 
            onClick={() => handleOpenDrawer()}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Add Skill
          </button>
        }
      />

      <div className="space-y-10">
        {categories.length > 0 ? categories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.filter(i => i.category === category).map(item => (
                <div key={item.id} className="group relative bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:border-gray-500 dark:hover:border-gray-500 transition-colors">
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    {item.image_url ? (
                      <Image src={resolveImageUrl(item.image_url)} alt={item.name} fill className="object-contain" />
                    ) : (
                      <FaCode size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.level}</p>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenDrawer(item)} className="p-1.5 bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-300 rounded hover:text-black dark:hover:text-white">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded hover:opacity-80">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="py-12 border border-dashed border-gray-300 dark:border-[#333] rounded-lg flex items-center justify-center text-sm text-gray-500">
            No skills cataloged yet.
          </div>
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDrawer}></div>
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0A0A0A] border-l border-gray-200 dark:border-[#1F1F1F] animate-in slide-in-from-right duration-500 flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1F1F1F] flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {editingItem ? "Edit Skill" : "Add Skill"}
              </h2>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-black dark:hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex flex-col mb-4">
                 <label className={labelClass}>Skill Logo (SVG/PNG)</label>
                 <div className="flex items-center gap-4 mt-2">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-md flex items-center justify-center overflow-hidden p-2">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <Image src={resolveImageUrl(imagePreview)} alt="Logo" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">None</span>
                      )}
                   </div>
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-black dark:text-white bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#2A2A2A]">
                     Choose File
                   </button>
                   <input type="file" ref={fileInputRef} accept="image/*,.svg" onChange={handleFileSelect} className="hidden" />
                 </div>
              </div>

              <form id="skill-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Technology / Skill Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="e.g. React.js" />
                </div>
                
                <div>
                  <label className={labelClass}>Category</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass} placeholder="e.g. Frontend" list="categories-list" />
                  <datalist id="categories-list">
                    <option value="Frontend" />
                    <option value="Backend" />
                    <option value="Database" />
                    <option value="Design" />
                    <option value="Tools" />
                  </datalist>
                </div>

                  <div>
                    <label className={labelClass}>Proficiency Level</label>
                    <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className={inputClass}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-[#1F1F1F] flex gap-3 bg-gray-50 dark:bg-[#111]">
              <button type="button" onClick={closeDrawer} className="px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-[#222]">
                Cancel
              </button>
              <button type="submit" form="skill-form" disabled={saveLoading} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-medium text-sm py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

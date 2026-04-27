"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Certification } from "@/types/database";
import Image from "next/image";
import { uploadFile, deleteFileFromUrl } from "@/lib/storage";
import { useNotification } from "@/components/NotificationContext";
import { resolveImageUrl } from "@/lib/image-utils";
import { FaCertificate } from "react-icons/fa";

export default function AdminCertifications() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certification | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast, confirmAction } = useNotification();
  
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    credential_url: ""
  });
  const [doesNotExpire, setDoesNotExpire] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('*').order('order_index');
    if (data) setItems(data);
    setLoading(false);
  };

  const handleOpenDrawer = (item: Certification | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        issuer: item.issuer,
        issue_date: item.issue_date || "",
        expiry_date: item.expiry_date || "",
        credential_url: item.credential_url || ""
      });
      setDoesNotExpire(!item.expiry_date);
      setImagePreview(item.image_url || null);
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        issuer: "",
        issue_date: "",
        expiry_date: "",
        credential_url: ""
      });
      setDoesNotExpire(false);
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
         const uploaded = await uploadFile(imageFile, 'certifications');
         if (uploaded) {
           if (editingItem?.image_url) await deleteFileFromUrl(editingItem.image_url);
           finalImageUrl = uploaded;
         }
      }

      const payload = { 
        ...formData, 
        expiry_date: doesNotExpire ? null : (formData.expiry_date || null),
        image_url: finalImageUrl 
      };

      if (editingItem) {
        await supabase.from('certifications').update(payload).eq('id', editingItem.id);
      } else {
        await supabase.from('certifications').insert(payload);
      }

      await fetchItems();
      showToast(editingItem ? "Certificate updated" : "Certificate added", "success");
      closeDrawer();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred while saving.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (item: Certification) => {
    confirmAction({
      title: "Remove Certification?",
      message: `Are you sure you want to remove the record for "${item.title}"?`,
      type: "danger",
      onConfirm: async () => {
        if (item.image_url) await deleteFileFromUrl(item.image_url);
        await supabase.from('certifications').delete().eq('id', item.id);
        fetchItems();
        showToast("Certificate removed successfully", "success");
      }
    });
  };

  const inputClass = "w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#333] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  if (loading) return (
    <div className="pt-10">
       <span className="text-sm font-medium text-gray-500">Loading certifications...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <AdminPageHeader 
        title="Certifications" 
        description="Verified credentials and professional achievements." 
        action={
          <button 
            onClick={() => handleOpenDrawer()}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Add Certificate
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group flex flex-col bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-lg overflow-hidden">
            <div className="aspect-[4/3] flex items-center justify-center relative bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-[#1F1F1F]">
               {item.image_url ? (
                 <Image src={resolveImageUrl(item.image_url)} alt={item.title} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaCertificate size={24} className="opacity-20" />
                 </div>
               )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.issuer}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">
                  Issued: {item.issue_date || "N/A"} 
                  {item.expiry_date ? ` · Expires: ${item.expiry_date}` : ' · No Expiry'}
                </span>
                {item.credential_url && (
                  <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-black dark:text-white hover:underline">
                    View
                  </a>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4 border-t border-gray-100 dark:border-[#1F1F1F] pt-4">
                <button onClick={() => handleOpenDrawer(item)} className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Edit
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-[#333]"></div>
                <button onClick={() => handleDelete(item)} className="text-xs font-medium text-red-600 dark:text-red-500 hover:opacity-80">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 border border-dashed border-gray-300 dark:border-[#333] rounded-lg flex items-center justify-center text-sm text-gray-500">
            No certifications found.
          </div>
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDrawer}></div>
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0A0A0A] border-l border-gray-200 dark:border-[#1F1F1F] animate-in slide-in-from-right duration-500 flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1F1F1F] flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {editingItem ? "Edit Certificate" : "Add Certificate"}
              </h2>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-black dark:hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex flex-col mb-4">
                 <label className={labelClass}>Certificate Document</label>
                 <div className="flex flex-col items-start gap-3 mt-2">
                   <div className="relative w-48 h-32 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-md flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <Image src={resolveImageUrl(imagePreview)} alt="Document" fill className="object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                   </div>
                   <div className="flex gap-2">
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-black dark:text-white bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#2A2A2A]">
                       Choose File
                     </button>
                     {imagePreview && (
                       <button type="button" onClick={() => {setImagePreview(null); setImageFile(null);}} className="text-xs font-medium text-red-600 hover:opacity-80 px-3 py-1.5 rounded-md">
                         Remove
                       </button>
                     )}
                   </div>
                   <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
                 </div>
              </div>

              <form id="cert-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Certification Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} />
                </div>
                
                <div>
                  <label className={labelClass}>Issuing Organization</label>
                  <input type="text" required value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Issue Date</label>
                    <input type="text" value={formData.issue_date} onChange={e => setFormData({...formData, issue_date: e.target.value})} className={inputClass} placeholder="e.g. 2023" />
                  </div>
                  <div>
                    <label className={labelClass}>Expiry Date</label>
                    <input type="text" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} disabled={doesNotExpire} className={`${inputClass} ${doesNotExpire ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="e.g. 2025" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="doesNotExpire" checked={doesNotExpire} onChange={e => setDoesNotExpire(e.target.checked)} className="rounded border-gray-300" />
                  <label htmlFor="doesNotExpire" className="text-sm text-gray-700 dark:text-gray-300">This credential does not expire</label>
                </div>

                <div>
                    <label className={labelClass}>Credential URL</label>
                    <input type="url" value={formData.credential_url} onChange={e => setFormData({...formData, credential_url: e.target.value})} className={inputClass} placeholder="https://" />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-[#1F1F1F] flex gap-3 bg-gray-50 dark:bg-[#111]">
              <button type="button" onClick={closeDrawer} className="px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-[#222]">
                Cancel
              </button>
              <button type="submit" form="cert-form" disabled={saveLoading} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-medium text-sm py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Project } from "@/types/database";
import Image from "next/image";
import { uploadFile, deleteFileFromUrl } from "@/lib/storage";
import { useNotification } from "@/components/NotificationContext";
import { resolveImageUrl } from "@/lib/image-utils";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast, confirmAction } = useNotification();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Completed",
    tech_stack: "",
    link: "",
  });

  const [existingImages, setExistingImages] = useState<{id: string, url: string}[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .order('order_index');
    if (data) setProjects(data);
    setLoading(false);
  };

  const handleOpenDrawer = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || "",
        status: project.status || "Completed",
        tech_stack: project.tech_stack || "",
        link: project.link || "",
      });
      const images = project.project_images?.map(img => ({ id: img.id, url: img.image_url })) || [];
      setExistingImages(images);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        status: "Completed",
        tech_stack: "",
        link: "",
      });
      setExistingImages([]);
    }
    setNewImageFiles([]);
    setPreviewUrls([]);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingProject(null);
      setNewImageFiles([]);
      setPreviewUrls([]);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = async (imgId: string, imgUrl: string) => {
    confirmAction({
      title: "Delete Image?",
      message: "This will permanently remove the image from the project gallery.",
      type: "danger",
      onConfirm: async () => {
        await deleteFileFromUrl(imgUrl);
        await supabase.from('project_images').delete().eq('id', imgId);
        setExistingImages(prev => prev.filter(img => img.id !== imgId));
        fetchProjects();
        showToast("Image deleted successfully", "success");
      }
    });
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    const projectData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      tech_stack: formData.tech_stack,
      link: formData.link || null,
    };

    try {
      let currentProjectId = editingProject?.id;

      if (editingProject) {
        await supabase.from('projects').update(projectData).eq('id', editingProject.id);
      } else {
        const { data: newProj } = await supabase.from('projects').insert(projectData).select().single();
        if (newProj) currentProjectId = newProj.id;
      }

      if (currentProjectId && newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map(file => uploadFile(file, 'projects'));
        const uploadedUrls = await Promise.all(uploadPromises);
        const existingCount = existingImages.length;
        const imagesToInsert = uploadedUrls
          .filter((url): url is string => url !== null)
          .map((url, i) => ({ 
            project_id: currentProjectId, 
            image_url: url, 
            is_main: (existingCount === 0 && i === 0) 
          }));

        if (imagesToInsert.length > 0) {
          await supabase.from('project_images').insert(imagesToInsert);
        }
      }
      
      await fetchProjects();
      showToast(editingProject ? "Project updated" : "Project created", "success");
      closeDrawer();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred while saving.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (project: Project) => {
    confirmAction({
      title: "Remove Project?",
      message: `Are you sure you want to remove "${project.title}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        const images = project.project_images || [];
        for (const img of images) await deleteFileFromUrl(img.image_url);
        await supabase.from('project_images').delete().eq('project_id', project.id);
        await supabase.from('projects').delete().eq('id', project.id);
        fetchProjects();
        showToast("Project removed successfully", "success");
      }
    });
  };

  const inputClass = "w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-[#333] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  if (loading) return (
    <div className="pt-10">
       <span className="text-sm font-medium text-gray-500">Loading projects...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <AdminPageHeader 
        title="Projects" 
        description="Public repository of your built applications and designs." 
        action={
          <button 
            onClick={() => handleOpenDrawer()}
             className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Create Project
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group flex flex-col bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1F1F1F] rounded-lg overflow-hidden">
            <div className="aspect-[16/9] relative bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-[#1F1F1F]">
               {project.project_images?.[0] ? (
                 <Image src={resolveImageUrl(project.project_images[0].image_url)} alt={project.title} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
               )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">{project.title}</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400">
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                {project.description}
              </p>
              <div className="flex justify-end gap-2 mt-auto border-t border-gray-100 dark:border-[#1F1F1F] pt-4">
                <button onClick={() => handleOpenDrawer(project)} className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  Edit
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-[#333]"></div>
                <button onClick={() => handleDelete(project)} className="text-xs font-medium text-red-600 dark:text-red-500 hover:opacity-80">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 border border-dashed border-gray-300 dark:border-[#333] rounded-lg flex items-center justify-center text-sm text-gray-500">
            No projects found.
          </div>
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDrawer}></div>
          
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#0A0A0A] border-l border-gray-200 dark:border-[#1F1F1F] animate-in slide-in-from-right duration-500 flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#1F1F1F] flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {editingProject ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-black dark:hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Project Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} />
                </div>
                
                <div>
                   <label className={labelClass}>Status</label>
                   <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={inputClass}>
                     <option>Completed</option>
                     <option>In Progress</option>
                   </select>
                </div>

                <div>
                  <label className={labelClass}>Visit Live Site (Link)</label>
                  <input type="url" placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass} resize-none`}></textarea>
                </div>


                <div>
                  <label className={labelClass}>Tech Stack / Tags (Comma separated)</label>
                  <input type="text" placeholder="e.g. Next.js, Tailwind, Supabase" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} className={inputClass} />
                  <p className="mt-1 text-[10px] text-gray-500">Separate frameworks/languages with commas.</p>
                </div>
              </form>

              <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F]">
                <div className="flex items-center justify-between mb-4">
                   <label className="text-sm font-medium text-gray-900 dark:text-white">Media Assets</label>
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-black dark:text-white bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] px-2 py-1 rounded">
                      Add File
                   </button>
                   <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative aspect-video rounded border border-gray-200 dark:border-[#333] overflow-hidden group">
                       <Image src={resolveImageUrl(img.url)} alt="Image" fill className="object-cover" />
                       <button onClick={() => removeExistingImage(img.id, img.url)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded text-[10px] opacity-0 group-hover:opacity-100">
                         Remove
                       </button>
                    </div>
                  ))}
                  
                  {previewUrls.map((url, i) => (
                    <div key={`new-${i}`} className="relative aspect-video rounded border border-gray-200 dark:border-[#333] overflow-hidden group">
                       <Image src={url} alt="New" fill className="object-cover opacity-70" />
                       <button onClick={() => removeNewImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded text-[10px] opacity-0 group-hover:opacity-100">
                         Remove
                       </button>
                    </div>
                  ))}
                </div>
                {existingImages.length === 0 && newImageFiles.length === 0 && (
                  <div className="text-xs text-gray-500 mt-2">No files attached.</div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-[#1F1F1F] flex gap-3 bg-gray-50 dark:bg-[#111]">
              <button type="button" onClick={closeDrawer} className="px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-[#222]">
                Cancel
              </button>
              <button type="submit" form="project-form" disabled={saveLoading} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-medium text-sm py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

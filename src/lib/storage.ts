import { supabase } from "./supabase";

const BUCKET_NAME = "portfolio-assets";

/**
 * Upload a file to Supabase Storage.
 * @param file The file object from <input type="file" />
 * @param folder The folder path (e.g., 'profile', 'projects', 'cv')
 * @returns The public URL of the uploaded file, or null if failed.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error: any) {
    console.error("Exception in uploadFile:", error);
    throw new Error(error.message || "Failed to upload file due to an unexpected error");
  }
}

/**
 * Delete a file from Supabase Storage based on its public URL.
 * @param fileUrl The public URL of the file to delete.
 */
export async function deleteFileFromUrl(fileUrl: string | null | undefined): Promise<boolean> {
  if (!fileUrl) return true;

  try {
    // Extract the relative path from the public URL.
    // Example URL: https://[project_id].supabase.co/storage/v1/object/public/portfolio-assets/profile/file123.jpg
    const searchString = `/object/public/${BUCKET_NAME}/`;
    const startIndex = fileUrl.indexOf(searchString);
    
    if (startIndex === -1) {
      console.warn("Not a valid Supabase storage URL:", fileUrl);
      return false; // Could be an external URL or placeholder, nothing to delete.
    }

    const filePath = fileUrl.substring(startIndex + searchString.length);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in deleteFileFromUrl:", error);
    return false;
  }
}

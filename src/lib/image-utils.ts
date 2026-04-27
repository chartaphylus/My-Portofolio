/**
 * Utility to resolve image URLs from Supabase or legacy local paths.
 * @param url The image URL string.
 * @returns A valid URL or a placeholder if invalid.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "/image/placeholder.png"; // Fallback placeholder

  // If it's already a full URL (Supabase, etc.), return it
  if (url.startsWith("http")) {
    return url;
  }

  // If it's a legacy local path that is known to be missing, 
  // return a placeholder to avoid 404s in the terminal.
  if (url.startsWith("/project/") || url.startsWith("/sertifikat/")) {
    // console.warn("Legacy local path detected, please re-upload in admin:", url);
    return "https://via.placeholder.com/800x450?text=Please+Re-upload+in+Admin";
  }

  // If it's a relative path to the public folder (like /image/Logo.png), return it
  if (url.startsWith("/")) {
    return url;
  }

  return "/image/placeholder.png";
}

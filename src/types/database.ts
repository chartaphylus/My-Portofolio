export interface Profile {
  id: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  profile_image_url: string;
  cv_url: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    medium?: string;
    [key: string]: string | undefined;
  };
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface SiteSettings {
  id: string;
  login_bg_url?: string;
  light_bg_color?: string;
  light_text_color?: string;
  light_primary_color?: string;
  dark_bg_color?: string;
  dark_text_color?: string;
  dark_primary_color?: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  image_url?: string;
  level: string;
  order_index: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo_url: string;
  type: string;
  work_model?: string;
  period: string;
  status: string;
  status_color: string;
  description: string;
  order_index: number;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  location: string;
  description: string;
  icon_type: string;
  logo_url?: string;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  link?: string;
  tech_stack?: string;
  order_index: number;
  project_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  is_main: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
  image_url: string;
  order_index: number;
}

export interface JournalPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  gallery_images?: string[];
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  featured: boolean;
  published_at?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface JournalPostFormData {
  title: string;
  excerpt: string;
  content: string;
  image?: File | string;
  gallery_images?: File[] | string[];
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  featured: boolean;
  published_at?: string;
  sort_order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  data?: JournalPost;
}

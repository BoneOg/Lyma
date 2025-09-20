import { useState, useEffect, useCallback } from 'react';
import { JournalPost, JournalPostFormData, SaveResponse } from '@/types/journal';

interface UseJournalPostOptions {
  id?: number;
  autosaveInterval?: number; // in milliseconds
}

export const useJournalPost = ({ id, autosaveInterval = 30000 }: UseJournalPostOptions = {}) => {
  const [journalPost, setJournalPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch journal post
  const fetchJournalPost = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/admin/api/journal-entries/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch journal post: ${response.statusText}`);
      }
      
      const data = await response.json();
      setJournalPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch journal post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Save journal post
  const saveJournalPost = useCallback(async (formData: JournalPostFormData): Promise<SaveResponse> => {
    setSaving(true);
    setError(null);

    try {
      // Prefer explicit id, otherwise use the id from the currently loaded post (for newly created posts)
      const targetId = id ?? journalPost?.id;
      const isCreate = !targetId;
      const url = isCreate ? '/admin/api/journal-entries' : `/admin/api/journal-entries/${targetId}`;
      const method = isCreate ? 'POST' : 'PUT';

      // Send as multipart/form-data if we have a File for image; else JSON
      const slugify = (s: string) => s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const ensurePayload = (suffix?: string) => {
        const payload: any = { ...formData } as any;
        const baseSlug = slugify(formData.title || 'post');
        payload.slug = suffix ? `${baseSlug}-${suffix}` : baseSlug;
        // Normalize booleans to numeric flags expected by validator
        payload.is_active = formData.is_active ? 1 : 0;
        payload.featured = formData.featured ? 1 : 0;
        // Do not send existing image string on update; only send when new File provided
        if (payload.image && typeof payload.image === 'string') {
          delete payload.image;
        }
        return payload;
      };

      async function requestOnce(payload: any): Promise<Response> {
        if (payload.image && typeof payload.image !== 'string') {
          const data = new FormData();
          data.append('title', payload.title);
          data.append('excerpt', payload.excerpt);
          data.append('content', payload.content);
          data.append('is_active', String(payload.is_active ? 1 : 0));
          data.append('featured', String(payload.featured ? 1 : 0));
          if (payload.published_at) data.append('published_at', payload.published_at);
          data.append('sort_order', String(payload.sort_order ?? 0));
          data.append('slug', payload.slug);
          if (payload.meta_title) data.append('meta_title', payload.meta_title);
          if (payload.meta_description) data.append('meta_description', payload.meta_description);
          data.append('image', payload.image as unknown as File);
          return fetch(url, {
            method,
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: data,
          });
        }
        return fetch(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify(ensurePayload()),
        });
      }

      // First attempt
      let response = await requestOnce(ensurePayload());
      if (!response.ok) {
        const text = await response.text();
        // Retry once with unique slug suffix (keep title untouched)
        if (/Duplicate entry|slug_unique/i.test(text)) {
          const uniqueSuffix = Date.now().toString(36).slice(-6);
          response = await requestOnce(ensurePayload(uniqueSuffix));
        } else {
          throw new Error(`Failed to save journal post: ${response.status} ${response.statusText} ${text}`);
        }
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to save journal post: ${response.status} ${response.statusText} ${text}`);
      }

      const result = await response.json();
      setJournalPost(result);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      return {
        success: true,
        message: 'Journal post saved successfully',
        data: result,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save journal post';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setSaving(false);
    }
  }, [id, journalPost]);

  // Auto-save functionality
  const autoSave = useCallback(async (formData: JournalPostFormData) => {
    if (!hasUnsavedChanges || saving) return;
    
    try {
      await saveJournalPost(formData);
    } catch (err) {
      console.warn('Auto-save failed:', err);
    }
  }, [hasUnsavedChanges, saving, saveJournalPost]);

  // Mark content as changed
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Load journal post on mount
  useEffect(() => {
    if (id) {
      fetchJournalPost();
    }
  }, [id, fetchJournalPost]);

  return {
    journalPost,
    loading,
    saving,
    error,
    lastSaved,
    hasUnsavedChanges,
    fetchJournalPost,
    saveJournalPost,
    autoSave,
    markAsChanged,
    setJournalPost,
  };
};

// Hook for auto-save timer
export const useAutoSave = (
  autoSave: (formData: JournalPostFormData) => Promise<void>,
  formData: JournalPostFormData,
  interval: number = 30000
) => {
  useEffect(() => {
    // Allow disabling autosave by passing a non-positive interval
    if (interval <= 0) return;
    const timer = setInterval(() => {
      autoSave(formData);
    }, interval);

    return () => clearInterval(timer);
  }, [autoSave, formData, interval]);
};

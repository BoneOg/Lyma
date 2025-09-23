import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { usePage } from '@inertiajs/react';
import JournalEditor from '@/components/admin/JournalEditor';
import JournalContentPreview from '@/components/admin/JournalContentPreview';
import { useJournalPost, useAutoSave } from '@/hooks/useJournalPost';
import { useNotification } from '@/contexts/NotificationContext';
import { JournalPostFormData } from '@/types/journal';
import PatternBackground from '@/components/PatternBackground';

const JournalEditPage: React.FC = () => {
  const { props } = usePage();
  const { showNotification } = useNotification();
  const url = window.location.pathname;
  const isNewPost = url.includes('/new');
  const id = isNewPost ? undefined : url.split('/').pop();
  
  const [formData, setFormData] = useState<JournalPostFormData>({
    title: '',
    excerpt: '',
    content: '',
    is_active: true,
    featured: false,
    image: undefined,
    published_at: '',
    sort_order: 0,
    meta_title: '',
    meta_description: '',
  });

  // Local preview for newly selected image (before server responds)
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const {
    journalPost,
    loading,
    saving,
    error,
    lastSaved,
    hasUnsavedChanges,
    saveJournalPost,
    autoSave,
    markAsChanged,
    setJournalPost,
  } = useJournalPost({ 
    id: id ? parseInt(id) : undefined,
    autosaveInterval: 30000 
  });

  // Auto-save every 30s on edit, disabled on new
  useAutoSave(autoSave, formData, isNewPost ? 0 : 30000);

  // Prevent any accidental form submissions on this page (e.g., Enter key in inputs)
  useEffect(() => {
    const preventSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener('submit', preventSubmit, true);
    return () => document.removeEventListener('submit', preventSubmit, true);
  }, []);

  // Update form data when journal post is loaded
  useEffect(() => {
    if (journalPost) {
      setFormData({
        title: journalPost.title,
        excerpt: journalPost.excerpt,
        content: journalPost.content,
        is_active: journalPost.is_active,
        featured: journalPost.featured,
        image: journalPost.image,
        published_at: journalPost.published_at || '',
        sort_order: journalPost.sort_order || 0,
        meta_title: (journalPost as any).meta_title || '',
        meta_description: (journalPost as any).meta_description || '',
      });
    } else if (isNewPost) {
      // For new posts, fetch next sort order (ensure route not shadowed)
      fetch('/admin/api/journal-entries/next-sort')
        .then(r => r.json())
        .then(d => {
          setFormData(prev => ({ ...prev, sort_order: Math.max(1, parseInt(String(d.next || 1))) }));
        })
        .catch(() => {});
    }
  }, [journalPost]);

  // SEO autofill with manual override support
  const [metaTitleEdited, setMetaTitleEdited] = useState(false);
  const [metaDescEdited, setMetaDescEdited] = useState(false);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
  };

  const truncate = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1).trimEnd() : s);

  const generateMetaTitle = (title: string) => truncate((title || '').trim(), 60);
  const generateMetaDescription = (excerpt: string, content: string) => {
    const base = (excerpt && excerpt.trim()) || stripHtml(content || '');
    return truncate(base, 160);
  };

  // Suggest next sort order based on existing post if any (simple client hint)
  const suggestedNextSort = Math.max(1, (journalPost?.sort_order || 0) + 1);

  useEffect(() => {
    setFormData(prev => {
      const next = { ...prev };
      if (!metaTitleEdited) next.meta_title = generateMetaTitle(prev.title || '');
      if (!metaDescEdited) next.meta_description = generateMetaDescription(prev.excerpt || '', prev.content || '');
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, formData.excerpt, formData.content]);

  // Handle form field changes
  const handleFieldChange = (field: keyof JournalPostFormData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    markAsChanged();
  };

  // Handle content change from TinyMCE
  const handleContentChange = (content: string) => {
    handleFieldChange('content', content);
  };

  // Handle featured image selection -> opens cropper
  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Enforce max size (5MB). Adjust here if you choose 10MB later.
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showNotification('Image exceeds the 5MB limit. Please choose a smaller file.', 'error');
      return;
    }

    // Convert to WebP in-browser when not already WebP
    const convertToWebP = (inputFile: File): Promise<File> => {
      return new Promise((resolve) => {
        if (inputFile.type === 'image/webp') {
          resolve(inputFile);
          return;
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const objectUrl = URL.createObjectURL(inputFile);
        img.src = objectUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const targetSize = 500 * 1024; // ~500KB target after conversion
          let quality = 0.85;

          const exportBlob = (q: number) => new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', q));

          const tryCompress = async (): Promise<File> => {
            let blob = await exportBlob(quality);
            // Fallback if toBlob returns null
            if (!blob) {
              blob = new Blob([], { type: 'image/webp' });
            }
            while (blob.size > targetSize && quality > 0.5) {
              quality -= 0.05;
              const next = await exportBlob(quality);
              if (next) blob = next;
              else break;
            }
            const webpFile = new File([blob], inputFile.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
            return webpFile;
          };

          tryCompress().then((webpFile) => {
            URL.revokeObjectURL(objectUrl);
            resolve(webpFile);
          });
        };
      });
    };

    // For cropping, show original image first (no conversion yet)
    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
    setShowCropper(true);
    setShowImageModal(false);
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedBlob = (imageSrc: string, cropPixels: { x: number; y: number; width: number; height: number; }): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas unavailable')); return; }
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        canvas.toBlob((blob) => {
          if (blob) resolve(blob); else reject(new Error('Failed to crop'));
        }, 'image/png', 1);
      };
      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = imageSrc;
    });
  };

  const confirmCrop = async () => {
    if (!cropSrc || !croppedAreaPixels) { setShowCropper(false); return; }
    try {
      // Get cropped PNG blob
      const croppedBlob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      // Convert cropped blob to File for existing converter pipeline
      const croppedFile = new File([croppedBlob], 'featured.png', { type: 'image/png' });

      // Reuse conversion to WebP and preview
      const convertToWebP = (inputFile: File): Promise<File> => {
        return new Promise((resolve) => {
          if (inputFile.type === 'image/webp') { resolve(inputFile); return; }
          const img = new Image();
          img.crossOrigin = 'anonymous';
          const objectUrl = URL.createObjectURL(inputFile);
          img.src = objectUrl;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            let quality = 0.85;
            const exportBlob = (q: number) => new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', q));
            (async () => {
              let blob = await exportBlob(quality);
              if (!blob) { blob = new Blob([], { type: 'image/webp' }); }
              while (blob.size > 500 * 1024 && quality > 0.5) {
                quality -= 0.05; const next = await exportBlob(quality); if (next) blob = next; else break;
              }
              URL.revokeObjectURL(objectUrl);
              resolve(new File([blob], 'featured.webp', { type: 'image/webp' }));
            })();
          };
        });
      };

      const webpFile = await convertToWebP(croppedFile);
    const objectUrl = URL.createObjectURL(webpFile);
    setLocalImagePreview(objectUrl);
    setFormData(prev => ({ ...prev, image: webpFile as unknown as File }));
      showNotification('Image cropped and added.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to crop image.', 'error');
    } finally {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
      setShowCropper(false);
      setCropSrc(null);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      const saved = await saveJournalPost(formData);
      // Align base post with current form so unsaved indicator clears
      setJournalPost(prev => prev ? { ...prev, ...formData } : ({ ...(formData as any) }));
      showNotification('Journal post saved successfully.', 'success');
    } catch (err) {
      console.error('Save failed:', err);
      showNotification('Failed to save journal post.', 'error');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    window.location.href = '/admin/journal';
  };

  // Format last saved time
  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  // Resolve image to display in previews (prefer unsaved form image)
  const displayImage: string | undefined =
    localImagePreview || (typeof formData.image === 'string' ? formData.image : (journalPost?.image || undefined));

  // Normalize any image path to a usable URL
  const normalizeImageUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    if (url.startsWith('/')) return url;
    if (url.startsWith('storage/')) return `/${url}`;
    if (url.startsWith('public/')) return `/${url}`;
    return `/storage/${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading journal post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Journal Post</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-olive text-beige rounded-lg hover:bg-olive-dark transition-colors"
          >
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive relative">
      {/* Pattern Background */}
      <div className="fixed inset-0 z-0">
        <PatternBackground 
          overrides={{
            carabao: 'absolute top-1/4 -translate-y-1/2 left-2 lg:left-4 w-32 lg:w-52 rotate-[-10deg] opacity-20',
            sugarcane: 'absolute bottom-[20%] left-[20%] w-22 lg:w-36 rotate-[-1deg] -translate-x-4 opacity-20',
            scallop: 'hidden lg:block absolute top-16 left-[20%] w-14 rotate-[6deg] opacity-20',
            fish: 'absolute top-[35%] right-2 lg:right-8 w-20 lg:w-64 rotate-[5deg] translate-x-0 lg:translate-x-32 opacity-20',
            logo: 'absolute bottom-5 right-2 lg:right-0 w-24 lg:w-52 rotate-[-6deg] translate-x-0 lg:translate-x-3 translate-y-0 lg:translate-y-3 opacity-20',
            grapes: 'absolute bottom-0 left-2 lg:left-6 w-20 lg:w-36 rotate-[-1deg] -translate-x-0 lg:-translate-x-4 opacity-20'
          }}
        />
      </div>
      {/* Sticky Header + Toolbar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between font-lexend">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-olive hover:text-olive transition-colors tracking-wide uppercase text-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Journal
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-light tracking-wide uppercase text-gray-900">
              {journalPost ? `Edit: ${journalPost.title}` : 'New Journal Post'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status indicators */}
            <div className="flex items-center space-x-4 text-sm text-olive">
              {lastSaved && (
                <span>Last saved: {formatLastSaved(lastSaved)}</span>
              )}
              <span className={hasUnsavedChanges ? 'text-red-300' : 'text-olive'}>
                {hasUnsavedChanges ? '• Unsaved changes' : '• All changes saved'}
              </span>
              {saving && (
                <span className="text-olive">• Saving...</span>
              )}
            </div>
            
            {/* Save button */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); handleSave(); }}
              disabled={saving}
              className="px-4 py-2 bg-olive text-beige rounded-lg hover:bg-olive-light disabled:bg-white/50 disabled:text-olive/50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        {/* Controls row */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-6 font-lexend flex-nowrap">
          {/* Meta inputs on the left - horizontal with weighted widths */}
          <div className="flex-1 min-w-0 flex items-center gap-4 overflow-hidden">
            <div className="basis-2/5 min-w-[220px]">
              <label className="block text-[11px] tracking-wide text-gray-600 mb-1 uppercase">Meta Title (SEO)</label>
              <input
                type="text"
                value={formData.meta_title || ''}
                onChange={(e) => { setMetaTitleEdited(true); handleFieldChange('meta_title', e.target.value); }}
                className="w-full h-9 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-olive focus:border-transparent bg-background text-foreground"
                placeholder="SEO title (~60 chars)"
                maxLength={70}
              />
            </div>
            <div className="basis-3/5 min-w-[320px]">
              <label className="block text-[11px] tracking-wide text-gray-600 mb-1 uppercase">Meta Description (SEO)</label>
              <input
                type="text"
                value={formData.meta_description || ''}
                onChange={(e) => { setMetaDescEdited(true); handleFieldChange('meta_description', e.target.value); }}
                className="w-full h-9 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-olive focus:border-transparent bg-background text-foreground"
                placeholder="SEO description (~160 chars)"
                maxLength={200}
              />
            </div>
          </div>

          {/* Controls group aligned horizontally on the right */}
          <div className="flex items-center gap-6 text-sm shrink-0 pt-6">
            <label className="flex items-center gap-2">
              <span className="text-gray-600">Sort</span>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => {
                  const raw = e.target.value;
                  // Disallow 0 and negatives; coerce to at least 1
                  const parsed = parseInt(raw || '1');
                  const val = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
                  handleFieldChange('sort_order', val);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); } }}
                className="w-20 h-9 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-olive focus:border-transparent"
                placeholder={String(suggestedNextSort)}
              />
            </label>
            {/* Olive switches matching site style */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
              <span className="text-gray-700">Active</span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('is_active', !formData.is_active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 ${formData.is_active ? 'bg-olive' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center gap-2">
              <span className="text-gray-700">Featured</span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('featured', !formData.featured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 ${formData.featured ? 'bg-olive' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
          {/* Save button remains only in the top header; remove duplicate here */
          }
        </div>
      </div>

      {/* Main Content - exact public layout replica */}
      <div className="relative z-10 flex-1">
        {/* Hero Section (display only; separate upload button) */}
        <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
          <div className="absolute inset-0">
            {displayImage ? (
              <img 
                src={normalizeImageUrl(displayImage)}
                alt={formData.title || 'Journal'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No featured image yet</div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40" />
          {/* Upload trigger button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="px-3 py-1.5 bg-olive text-beige rounded-md hover:bg-olive-dark transition-colors text-sm font-lexend tracking-wide uppercase"
            >
              Upload Featured Image
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center text-sm font-lexend mb-4">
                {/* calendar icon space holder */}
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <input
                  type="date"
                  value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 10) : ''}
                  onChange={(e) => handleFieldChange('published_at', e.target.value)}
                  className="bg-white/80 text-gray-900 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent text-3xl sm:text-4xl lg:text-5xl font-light font-lexend tracking-wide uppercase mb-4 placeholder-white/60 focus:outline-none break-words"
              />
              <textarea
                value={formData.excerpt}
                onChange={(e) => { handleFieldChange('excerpt', e.target.value); e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                placeholder="Excerpt"
                rows={2}
                className="w-full bg-transparent text-lg font-lexend opacity-90 max-w-2xl placeholder-white/60 focus:outline-none break-words resize-none overflow-hidden"
              />
            </div>
          </div>
        </div>

        {/* Content container replica */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back to Journal (text-only visual) */}
          <div className="mb-8">
            <div className="inline-flex items-center text-beige transition-colors font-lexend text-sm tracking-wide uppercase">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to Journal
            </div>
          </div>

          {/* Content input box */}
          <div className="bg-white border border-border rounded-lg mb-8 p-4">
            <JournalEditor
              content={formData.content}
              onChange={handleContentChange}
              height={undefined}
            />
          </div>

          {/* Share Section replica (text-only) */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-lexend text-beige tracking-wide uppercase">Share this story</span>
              </div>
              <div className="inline-flex items-center text-beige transition-colors font-lexend text-sm tracking-wide uppercase">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                Back to Journal
              </div>
            </div>
          </div>
        </div>

        {/* SEO footer removed: meta fields moved to sticky header */}
      </div>
      {/* Image upload modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-lexend mb-1">Upload Featured Image</h3>
            <p className="text-sm text-gray-600 mb-4">Allowed formats: JPG or PNG. Max size: 5MB. The image will be converted to WebP automatically.</p>
            <div className="rounded-md border border-gray-300 bg-gray-50 p-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Choose JPG/PNG up to 5MB</span>
              <label className="px-3 py-2 bg-olive text-beige rounded-md hover:bg-olive-dark transition-colors text-sm font-lexend cursor-pointer">
                Choose File
              <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={(e) => { handleFeaturedImageChange(e); /* modal closes when cropper opens */ }}
                  className="hidden"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-lexend"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cropper modal */}
      {showCropper && cropSrc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-lexend mb-4">Adjust Featured Image (16:9)</h3>
            <div className="relative w-full h-[50vh] bg-gray-100 rounded-md overflow-hidden mb-4">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Zoom</span>
                <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowCropper(false); if (cropSrc) URL.revokeObjectURL(cropSrc); setCropSrc(null); }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md font-lexend">Cancel</button>
                <button onClick={confirmCrop} className="px-3 py-1.5 bg-olive text-beige rounded-md hover:bg-olive-dark font-lexend">Use Image</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEditPage;
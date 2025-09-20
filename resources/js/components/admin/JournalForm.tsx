import React from 'react';
import { motion, easeOut } from 'framer-motion';
import { Image as ImageIcon, Type } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface JournalEntry {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image: string;
  gallery_images?: string[];
  meta_title?: string;
  meta_description?: string;
  sort_order: number;
  is_active: boolean;
  featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface JournalFormProps {
  showModal: boolean;
  editingEntry: JournalEntry | null;
  formData: {
    title: string;
    excerpt: string;
    content: string;
    image: File | null;
    gallery_images: File[];
    meta_title: string;
    meta_description: string;
    sort_order: number;
    is_active: boolean;
    featured: boolean;
    published_at: string;
  };
  previewImage: string | null;
  loading: boolean;
  entries: JournalEntry[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: Partial<JournalFormProps['formData']>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getNextSortOrder: () => number;
}

const JournalForm: React.FC<JournalFormProps> = ({
  showModal,
  editingEntry,
  formData,
  previewImage,
  loading,
  entries,
  onClose,
  onSubmit,
  onFormDataChange,
  onImageChange,
  onGalleryImagesChange,
  getNextSortOrder
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: easeOut }}
        className="bg-card rounded-lg w-full max-w-7xl mx-4 max-h-[95vh] overflow-hidden border border-border relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex h-full">
          {/* Left Sidebar - 1/4 width */}
          <div className="w-1/4 bg-muted/30 border-r border-border p-6 overflow-y-auto" style={{ height: 'calc(95vh - 2rem)' }}>
            <h2 className="text-xl font-bold mb-6 text-foreground font-lexend">
              {editingEntry ? 'Edit Journal Entry' : 'Add New Journal Entry'}
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground font-lexend border-b border-border pb-2">
                  Basic Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    <Type className="w-4 h-4 inline mr-1" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onFormDataChange({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => onFormDataChange({ excerpt: e.target.value })}
                    placeholder="Brief description of the journal entry..."
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend h-20 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-lexend">
                    {formData.excerpt.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground font-lexend border-b border-border pb-2">
                  Images
                </h3>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Featured Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend"
                    required={!editingEntry}
                  />
                  {previewImage && (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    Gallery Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onGalleryImagesChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend"
                  />
                  {formData.gallery_images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground font-lexend mb-2">
                        Selected files: {formData.gallery_images.length}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.gallery_images.map((file, index) => (
                          <span key={index} className="text-xs bg-muted px-2 py-1 rounded font-lexend">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground font-lexend border-b border-border pb-2">
                  SEO Settings
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => onFormDataChange({ meta_title: e.target.value })}
                    placeholder="SEO title (if different from main title)"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => onFormDataChange({ meta_description: e.target.value })}
                    placeholder="SEO description for search engines..."
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend h-20 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-lexend">
                    {formData.meta_description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground font-lexend border-b border-border pb-2">
                  Settings
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      onFormDataChange({ sort_order: value });
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend"
                    min="1"
                    placeholder={`Next available: ${getNextSortOrder()}`}
                  />
                  {formData.sort_order > 0 && entries.some(entry => entry.sort_order === formData.sort_order && entry.id !== editingEntry?.id) && (
                    <p className="text-sm text-destructive mt-1 font-lexend">This sort order is already taken</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1 font-lexend">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => onFormDataChange({ published_at: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground font-lexend"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground font-lexend">
                      Status
                    </label>
                    <button
                      type="button"
                      onClick={() => onFormDataChange({ is_active: !formData.is_active })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formData.is_active ? 'bg-olive' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground font-lexend">
                      Featured
                    </label>
                    <button
                      type="button"
                      onClick={() => onFormDataChange({ featured: !formData.featured })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formData.featured ? 'bg-olive' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.featured ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Right Side - Content Editor - 3/4 width */}
          <div className="w-3/4 p-6 flex flex-col" style={{ height: 'calc(95vh - 2rem)' }}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground font-lexend mb-2">
                Content Editor
              </h3>
              <p className="text-sm text-muted-foreground font-lexend">
                Write your journal entry content here. Use the toolbar to format text, add lists, and insert images.
              </p>
            </div>
            
            <div className="flex-1 mb-4">
              <RichTextEditor
                value={formData.content}
                onChange={(content) => onFormDataChange({ content })}
                height={400}
                placeholder="Start writing your journal entry..."
              />
            </div>

            {/* Form Buttons - Bottom Right */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors font-lexend"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-olive text-beige rounded-md hover:bg-olive-dark transition-colors disabled:opacity-50 font-lexend font-medium"
                onClick={onSubmit}
              >
                {loading ? 'Saving...' : (editingEntry ? 'Update Entry' : 'Create Entry')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JournalForm;

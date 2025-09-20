import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface JournalPreviewProps {
  entries: JournalEntry[];
  previewIndex: number;
  onNextPreview: () => void;
  onPrevPreview: () => void;
  onGoToPreview: (index: number) => void;
  onAddNew: () => void;
}

const JournalPreview: React.FC<JournalPreviewProps> = ({
  entries,
  previewIndex,
  onNextPreview,
  onPrevPreview,
  onGoToPreview,
  onAddNew
}) => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground font-lexend">Preview</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-olive text-beige px-6 py-3 rounded-lg hover:bg-olive-dark transition-colors font-lexend font-medium"
        >
          <Plus className="w-4 h-4" />
          Add New Entry
        </button>
      </div>
      <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
        {entries.length > 0 ? (
          <div className="relative w-full h-full">
            <img 
              src={entries[previewIndex].image.startsWith('/storage/') ? entries[previewIndex].image : `/storage/${entries[previewIndex].image}`} 
              alt={entries[previewIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Navigation Arrows */}
            {entries.length > 1 && (
              <>
                <button
                  onClick={onPrevPreview}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                  aria-label="Previous preview"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={onNextPreview}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                  aria-label="Next preview"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end text-white">
                <h3 className="text-lg font-semibold font-lexend">{entries[previewIndex].title}</h3>
                <p className="text-sm font-lexend">{new Date(entries[previewIndex].published_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="font-lexend">No journal entries yet</p>
          </div>
        )}
        
        {/* Preview Indicators */}
        {entries.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {entries.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToPreview(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === previewIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to preview ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPreview;

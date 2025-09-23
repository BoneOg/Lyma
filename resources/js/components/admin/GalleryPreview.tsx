import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Star, StarOff } from 'lucide-react';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryPreviewProps {
  images: GalleryImage[];
  previewIndex: number;
  onNextPreview: () => void;
  onPrevPreview: () => void;
  onGoToPreview: (index: number) => void;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({
  images,
  previewIndex,
  onNextPreview,
  onPrevPreview,
  onGoToPreview
}) => {
  if (images.length === 0) return null;

  const currentImage = images[previewIndex];

  return (
    <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-lexend font-light text-olive text-lg">
            Image Preview ({previewIndex + 1} of {images.length})
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star 
                size={16} 
                className={currentImage.is_featured ? 'text-yellow-500' : 'text-gray-400'} 
              />
              <span className="text-sm font-lexend text-gray-600">
                {currentImage.is_featured ? 'Featured' : 'Gallery'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview */}
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <img
            src={currentImage.image_path.startsWith('/storage/') ? currentImage.image_path : `/storage/${currentImage.image_path}`}
            alt={currentImage.alt_text || `Gallery image ${previewIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevPreview}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white p-2 hover:bg-black/30 transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNextPreview}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white p-2 hover:bg-black/30 transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-lexend font-light text-sm">
                {currentImage.alt_text || 'No description'}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Sort Order: {currentImage.sort_order}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star 
                  size={16} 
                  className={currentImage.is_featured ? 'text-yellow-400' : 'text-gray-400'} 
                />
                <span className="text-sm">
                  {currentImage.is_featured ? 'Featured' : 'Gallery'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => onGoToPreview(index)}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all duration-200 ${
                  index === previewIndex
                    ? 'border-olive'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image.image_path.startsWith('/storage/') ? image.image_path : `/storage/${image.image_path}`}
                  alt={image.alt_text || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Featured indicator */}
                {image.is_featured && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-1">
                    ★
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Details */}
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-lexend font-medium text-gray-700 mb-1">Image Details</p>
            <p className="text-gray-600">
              <span className="font-medium">ID:</span> {currentImage.id}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span> {currentImage.is_featured ? 'Featured' : 'Gallery'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Sort Order:</span> {currentImage.sort_order}
            </p>
          </div>
          <div>
            <p className="font-lexend font-medium text-gray-700 mb-1">Timestamps</p>
            <p className="text-gray-600">
              <span className="font-medium">Created:</span> {new Date(currentImage.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Updated:</span> {new Date(currentImage.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPreview;
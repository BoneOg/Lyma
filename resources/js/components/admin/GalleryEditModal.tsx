import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryEditModalProps {
  image: GalleryImage;
  onClose: () => void;
  onUpdate: (image: GalleryImage) => void;
}

const GalleryEditModal: React.FC<GalleryEditModalProps> = ({ image, onClose, onUpdate }) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Store the original image source
  const originalImageSrc = image.image_path.startsWith('/storage/') ? image.image_path : `/storage/${image.image_path}`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedBlob = (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No 2d context'));
          return;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas is empty'));
          }
        }, 'image/jpeg', 0.9);
      };
      image.src = imageSrc;
    });
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append('image', croppedBlob, 'cropped-image.jpg');
      formData.append('_method', 'PUT');
      formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');

      const response = await fetch(`/admin/api/gallery-images/${image.id}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const updatedImage = await response.json();
        onUpdate(updatedImage.image);
        onClose();
      } else {
        throw new Error('Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
    } finally {
      setIsUploading(false);
      setShowCropModal(false);
    }
  };

  const handleDirectUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background text-olive rounded-none shadow-lg max-w-md w-full"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-xl font-lexend font-semibold tracking-tighter">Edit Image</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <img
                src={image.image_path.startsWith('/storage/') ? image.image_path : `/storage/${image.image_path}`}
                alt={image.alt_text || 'Gallery image'}
                className="w-full h-48 object-cover rounded-none"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDirectUpload}
                className="w-full bg-olive hover:bg-olive-light text-beige font-lexend font-light py-3 px-4 rounded-none transition-colors duration-200 flex items-center justify-center"
              >
                <Upload size={18} className="mr-2" />
                Upload New Image
              </button>
              
              <button
                onClick={() => {
                  setCropSrc(originalImageSrc);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                  setShowCropModal(true);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-olive font-lexend font-light py-3 px-4 rounded-none transition-colors duration-200 flex items-center justify-center"
              >
                <Crop size={18} className="mr-2" />
                Crop Current Image
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Crop Modal */}
      {showCropModal && cropSrc && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-xl border border-gray-200"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h3 className="text-lg font-lexend mb-4">Crop Image</h3>
            <div className="relative w-full h-[50vh] bg-gray-100 rounded-md overflow-hidden mb-4">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Zoom</span>
                <input 
                  type="range" 
                  min={0.5} 
                  max={3} 
                  step={0.01} 
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))} 
                />
                <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowCropModal(false);
                    if (cropSrc) URL.revokeObjectURL(cropSrc);
                    setCropSrc(null);
                  }} 
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md font-lexend"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCropConfirm}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-olive text-beige rounded-md hover:bg-olive-dark font-lexend disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Apply Crop'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default GalleryEditModal;

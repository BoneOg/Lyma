import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface GalleryUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ onClose, onSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // Initialize progress tracking
    const progress: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));
    setUploadProgress(progress);

    try {
      console.log('Starting upload with files:', files.length);
      console.log('FormData contents:', Array.from(formData.entries()));
      
      const response = await fetch('/admin/api/gallery-images/upload', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        
        // Update progress to success
        setUploadProgress(prev => 
          prev.map(p => ({ ...p, progress: 100, status: 'success' as const }))
        );

        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        console.error('Upload failed with status:', response.status);
        const responseText = await response.text();
        console.error('Response text:', responseText);
        
        let error;
        try {
          error = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          error = { message: responseText || 'Upload failed' };
        }
        
        throw new Error(error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update progress to error
      setUploadProgress(prev => 
        prev.map(p => ({ 
          ...p, 
          progress: 0, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-lexend font-light text-olive">Upload Gallery Images</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-none p-8 text-center transition-colors ${
              dragActive 
                ? 'border-olive bg-olive/5' 
                : 'border-gray-300 hover:border-olive'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2 font-lexend">
              Drag and drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              PNG, JPG, JPEG up to 10MB each
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-olive text-beige px-4 py-2 font-lexend font-light text-sm uppercase tracking-wider hover:bg-olive/90 transition-all duration-300"
            >
              Select Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-lexend font-light text-olive">Selected Files ({files.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <ImageIcon size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-lexend text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-lexend font-light text-olive">Upload Progress</h3>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-lexend text-gray-700">
                      {progress.file.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {progress.status === 'uploading' && `${progress.progress}%`}
                      {progress.status === 'success' && '✓ Complete'}
                      {progress.status === 'error' && '✗ Failed'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className={`h-2 transition-all duration-300 ${
                        progress.status === 'success' ? 'bg-green-500' :
                        progress.status === 'error' ? 'bg-red-500' : 'bg-olive'
                      }`}
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                  {progress.error && (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {progress.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-lexend font-light transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={uploadFiles}
              disabled={files.length === 0 || isUploading}
              className="bg-olive text-beige px-6 py-2 font-lexend font-light text-sm uppercase tracking-wider hover:bg-olive/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-beige" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload {files.length} Image{files.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GalleryUpload;

import React, { useState, useEffect } from 'react';
import { motion, easeOut } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import GalleryUpload from '@/components/admin/GalleryUpload';
import GalleryGrid from '@/components/admin/GalleryGrid';
import GalleryEditModal from '@/components/admin/GalleryEditModal';
import ConfirmationModal from '@/components/admin/AdminConfirmationModal';
import { useNotification } from '@/contexts/NotificationContext';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminGallery: React.FC = () => {
  const { showNotification } = useNotification();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/admin/api/gallery-images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        showNotification('Failed to fetch gallery images', 'error');
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      showNotification('Network error: Unable to fetch images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowEditModal(true);
  };

  const handleReorder = async (newOrder: GalleryImage[]) => {
    setImages(newOrder); // Optimistic update
    try {
      const response = await fetch('/admin/api/gallery-images/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ 
          images: newOrder.map(img => img.id)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reorder images');
      }
      showNotification('Images reordered successfully!', 'success');
    } catch (error) {
      console.error('Error reordering images:', error);
      showNotification('Failed to reorder images', 'error');
      fetchImages(); // Revert to server state on error
    }
  };

  const handleDelete = (image: GalleryImage) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(`/admin/api/gallery-images/${imageToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (response.ok) {
        showNotification('Gallery image deleted successfully!', 'success');
        await fetchImages();
      } else {
        showNotification('Failed to delete gallery image', 'error');
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      showNotification('Network error: Unable to delete image', 'error');
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchImages();
    showNotification('Images uploaded successfully!', 'success');
  };

  const handleImageUpdate = (updatedImage: GalleryImage) => {
    setImages(prev => prev.map(img => img.id === updatedImage.id ? updatedImage : img));
    setShowEditModal(false);
    setSelectedImage(null);
    showNotification('Image updated successfully!', 'success');
  };


  const toggleFeatured = async (image: GalleryImage) => {
    try {
      const response = await fetch(`/admin/api/gallery-images/${image.id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ is_featured: !image.is_featured })
      });

      if (response.ok) {
        showNotification(`Image ${image.is_featured ? 'removed from' : 'added to'} featured gallery`, 'success');
        await fetchImages();
      } else {
        showNotification('Failed to update image status', 'error');
      }
    } catch (error) {
      console.error('Error updating image status:', error);
      showNotification('Network error: Unable to update image', 'error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easeOut
      }
    },
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.2
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-none"
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 py-6 sm:py-8 md:py-10 lg:py-10 xl:py-10 2xl:py-10 space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-8 xl:space-y-8 2xl:space-y-8 font-lexend"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="mb-4 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl font-thin font-lexend text-olive">
              GALLERY
            </h1>
          </div>
          <div className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-32 2xl:w-32 h-[1px] bg-olive mx-auto" style={{ opacity: 0.5 }} />
        </motion.div>

        {/* Gallery Grid */}
        <motion.div variants={itemVariants}>
          <GalleryGrid
            images={images}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFeatured={toggleFeatured}
            onReorder={handleReorder}
            onUpload={() => setShowUploadModal(true)}
            variants={cardVariants}
          />
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <GalleryUpload
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleUploadSuccess}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedImage && (
          <GalleryEditModal
            image={selectedImage}
            onClose={() => {
              setShowEditModal(false);
              setSelectedImage(null);
            }}
            onUpdate={handleImageUpdate}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setImageToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Gallery Image"
          message={`Are you sure you want to delete this image? This action cannot be undone.`}
          type="cancel"
        />
      </motion.div>
    </AdminLayout>
  );
};

export default AdminGallery;

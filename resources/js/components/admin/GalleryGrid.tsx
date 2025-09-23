import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Star, StarOff, Eye } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onToggleFeatured: (image: GalleryImage) => void;
  onReorder: (newOrder: GalleryImage[]) => void;
  onUpload: () => void;
  variants?: any;
}

// Sortable Item Component
const SortableItem: React.FC<{
  image: GalleryImage;
  index: number;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onToggleFeatured: (image: GalleryImage) => void;
  variants?: any;
  isFeatured?: boolean;
}> = ({ image, index, onEdit, onDelete, onToggleFeatured, variants, isFeatured = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group aspect-square overflow-hidden bg-gray-100 ${
        isDragging ? 'ring-2 ring-olive-light' : ''
      }`}
      variants={variants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <img
        src={image.image_path.startsWith('/storage/') ? image.image_path : `/storage/${image.image_path}`}
        alt={image.alt_text || `Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured(image);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 bg-white/90 hover:bg-white/50 transition-all duration-200"
            title={isFeatured ? "Remove from featured" : "Add to featured"}
          >
            {isFeatured ? <StarOff size={14} className="text-yellow-600" /> : <Star size={14} className="text-yellow-600" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(image);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 bg-white/90 hover:bg-white/50 transition-all duration-200"
            title="Edit image"
          >
            <Edit size={14} className="text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 bg-white/90 hover:bg-white/50 transition-all duration-200"
            title="Delete image"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Badge - Only show FEATURED for featured images */}
      {isFeatured && (
        <div className="absolute top-1 left-1">
          <div className="px-1.5 py-0.5 text-xs font-lexend font-medium bg-yellow-500 text-white">
            FEATURED
          </div>
        </div>
      )}
    </motion.div>
  );
};

const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  onEdit,
  onDelete,
  onToggleFeatured,
  onReorder,
  onUpload,
  variants
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const reorderedImages = Array.from(images);
      const oldIndex = reorderedImages.findIndex(img => img.id === active.id);
      const newIndex = reorderedImages.findIndex(img => img.id === over.id);

      const newOrder = arrayMove(reorderedImages, oldIndex, newIndex);

      // Update sort_order based on new array index (1,2,3,4,5,6 from top to bottom)
      const updatedImages = newOrder.map((img, index) => ({
        ...img,
        sort_order: index + 1, // Simple order: first image gets 1, second gets 2, etc.
      }));

      onReorder(updatedImages);
    }
  };

  return (
    <div className="space-y-8">
      {/* Featured Images Section */}
      <div>
        <h3 className="font-lexend font-light text-olive text-lg mb-4 flex items-center">
          <Star size={20} className="mr-2" />
          Featured Images
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {images.filter(img => img.is_featured).slice(0, 3).map((image, index) => (
            <motion.div
              key={image.id}
              className="relative group aspect-square overflow-hidden bg-gray-100"
              variants={variants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={image.image_path.startsWith('/storage/') ? image.image_path : `/storage/${image.image_path}`}
                alt={image.alt_text || `Featured image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeatured(image);
                    }}
                    className="p-2 bg-white/90 hover:bg-white/50 transition-all duration-200"
                    title="Remove from featured"
                  >
                    <StarOff size={16} className="text-yellow-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(image);
                    }}
                    className="p-2 bg-white/90 hover:bg-white/50 transition-all duration-200"
                    title="Edit image"
                  >
                    <Edit size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(image);
                    }}
                    className="p-2 bg-white/90 hover:bg-white/50 transition-all duration-200"
                    title="Delete image"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Featured Badge */}
              <div className="absolute top-2 left-2">
                <div className="bg-yellow-500 text-white px-2 py-1 text-xs font-lexend font-medium">
                  FEATURED
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Empty slots for featured images */}
          {Array.from({ length: 3 - images.filter(img => img.is_featured).length }).map((_, index) => (
            <div
              key={`empty-featured-${index}`}
              className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              <p className="text-gray-400 font-lexend text-sm">Empty Slot</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images Section */}
      <div>
        <h3 className="font-lexend font-light text-olive text-lg mb-4 flex items-center">
          <Eye size={20} className="mr-2" />
          Gallery Images
        </h3>
        
        {images.filter(img => !img.is_featured).length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={images.filter(img => !img.is_featured).map(img => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {images.filter(img => !img.is_featured).map((image, index) => (
                  <div key={image.id} className="relative">
                    {/* Box Number */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="w-6 h-6 bg-olive text-beige rounded-full flex items-center justify-center text-xs font-lexend font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <SortableItem
                      image={image}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleFeatured={onToggleFeatured}
                      variants={variants}
                      isFeatured={false}
                    />
                  </div>
                ))}
                
                {/* Upload Button in Empty Slot */}
                <div className="relative">
                  {/* Box Number for Upload Slot */}
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-lexend font-medium">
                      {images.filter(img => !img.is_featured).length + 1}
                    </div>
                  </div>
                  <button
                    onClick={onUpload}
                    className="w-full aspect-square bg-gray-100 border-2 border-dashed border-gray-300 hover:border-olive hover:bg-olive/5 transition-all duration-200 flex flex-col items-center justify-center group"
                  >
                    <div className="text-gray-400 group-hover:text-olive transition-colors duration-200">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm font-lexend font-light">Upload Image</p>
                    </div>
                  </button>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          /* Empty state with upload button */
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <div className="relative">
              {/* Box Number for Upload Slot */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-lexend font-medium">
                  1
                </div>
              </div>
              <button
                onClick={onUpload}
                className="w-full aspect-square bg-gray-100 border-2 border-dashed border-gray-300 hover:border-olive hover:bg-olive/5 transition-all duration-200 flex flex-col items-center justify-center group"
              >
                <div className="text-gray-400 group-hover:text-olive transition-colors duration-200">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm font-lexend font-light">Upload Image</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-50 p-4 rounded-none">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-lexend font-light text-olive">
              {images.length}
            </p>
            <p className="text-sm text-gray-600 font-lexend">Total Images</p>
          </div>
          <div>
            <p className="text-2xl font-lexend font-light text-olive">
              {images.filter(img => img.is_featured).length}
            </p>
            <p className="text-sm text-gray-600 font-lexend">Featured</p>
          </div>
          <div>
            <p className="text-2xl font-lexend font-light text-olive">
              {images.filter(img => !img.is_featured).length}
            </p>
            <p className="text-sm text-gray-600 font-lexend">Gallery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryGrid;
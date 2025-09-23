<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\GalleryImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class GalleryController extends Controller
{
    /**
     * Get all gallery images for public display
     */
    public function index(): JsonResponse
    {
        try {
            $images = GalleryImage::ordered()->get();
            
            return response()->json($images);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch gallery images'], 500);
        }
    }

    /**
     * Get gallery images for admin
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $images = GalleryImage::ordered()->get();
            
            return response()->json($images);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch gallery images'], 500);
        }
    }

    /**
     * Upload multiple gallery images
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            \Log::info('Gallery upload started', [
                'files_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
                'request_data' => $request->all(),
                'user_id' => auth()->id(),
                'user_role' => auth()->user()?->role ?? 'unknown'
            ]);

            $validator = Validator::make($request->all(), [
                'images.*' => 'required|file|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
            ]);

            if ($validator->fails()) {
                \Log::error('Gallery upload validation failed', [
                    'errors' => $validator->errors()
                ]);
                return response()->json([
                    'error' => 'Validation failed',
                    'messages' => $validator->errors()
                ], 422);
            }

            $uploadedImages = [];
            $images = $request->file('images');

            \Log::info('Processing images', ['count' => count($images)]);

            foreach ($images as $index => $image) {
                try {
                    \Log::info('Processing image', [
                        'index' => $index,
                        'original_name' => $image->getClientOriginalName(),
                        'size' => $image->getSize(),
                        'mime' => $image->getMimeType()
                    ]);
                    
                    // Store the image first (same as journal approach)
                    $imagePath = $image->store('gallery', 'public');
                    
                    \Log::info('Image stored at: ' . $imagePath);
                    
                    // Resize and optimize the image (same as journal approach)
                    $this->resizeImage($imagePath);
                    
                    \Log::info('Image resized and optimized');
                    
                    // Verify the file exists and is readable
                    $fullPath = Storage::disk('public')->path($imagePath);
                    if (file_exists($fullPath)) {
                        \Log::info('File exists and is readable', [
                            'path' => $fullPath,
                            'size' => filesize($fullPath),
                            'mime' => mime_content_type($fullPath)
                        ]);
                    } else {
                        \Log::error('File does not exist after processing', ['path' => $fullPath]);
                    }
                    
                    // Get next sort order
                    $nextSortOrder = GalleryImage::max('sort_order') + 1;
                    
                    // Create gallery image record
                    $galleryImage = GalleryImage::create([
                        'image_path' => $imagePath,
                        'alt_text' => $image->getClientOriginalName(),
                        'sort_order' => $nextSortOrder,
                        'is_featured' => false,
                    ]);

                    \Log::info('Gallery image created', ['id' => $galleryImage->id]);
                    $uploadedImages[] = $galleryImage;
                    
                } catch (\Exception $imageError) {
                    \Log::error('Error processing individual image', [
                        'index' => $index,
                        'error' => $imageError->getMessage(),
                        'trace' => $imageError->getTraceAsString()
                    ]);
                    throw $imageError;
                }
            }

            \Log::info('Gallery upload completed successfully', [
                'uploaded_count' => count($uploadedImages)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully',
                'images' => $uploadedImages
            ]);

        } catch (\Exception $e) {
            \Log::error('Gallery upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Upload failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show a specific gallery image
     */
    public function show(GalleryImage $galleryImage): JsonResponse
    {
        try {
            return response()->json($galleryImage);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch gallery image', [
                'error' => $e->getMessage(),
                'image_id' => $galleryImage->id
            ]);

            return response()->json([
                'error' => 'Failed to fetch gallery image',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update gallery image
     */
    public function update(Request $request, GalleryImage $galleryImage): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'alt_text' => 'nullable|string|max:255',
                'sort_order' => 'nullable|integer|min:0',
                'is_featured' => 'nullable|boolean',
                'image' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'messages' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only(['alt_text', 'sort_order', 'is_featured']);

            // Handle image replacement
            if ($request->hasFile('image')) {
                // Delete old image
                Storage::disk('public')->delete($galleryImage->image_path);
                
                // Store new image
                $imageFile = $request->file('image');
                $imagePath = $imageFile->store('gallery', 'public');
                
                // Resize and optimize the new image
                $this->resizeImage($imagePath);
                
                $updateData['image_path'] = $imagePath;
            }

            $galleryImage->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Image updated successfully',
                'image' => $galleryImage
            ]);

        } catch (\Exception $e) {
            \Log::error('Gallery update failed', [
                'error' => $e->getMessage(),
                'image_id' => $galleryImage->id
            ]);

            return response()->json([
                'error' => 'Update failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(Request $request, GalleryImage $galleryImage): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'is_featured' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'messages' => $validator->errors()
                ], 422);
            }

            // If setting as featured, check if we already have 3 featured images
            if ($request->is_featured) {
                $featuredCount = GalleryImage::where('is_featured', true)->count();
                if ($featuredCount >= 3) {
                    return response()->json([
                        'error' => 'Maximum 3 featured images allowed',
                        'message' => 'You can only have 3 featured images at a time. Please remove one first.'
                    ], 422);
                }
            }

            $galleryImage->update(['is_featured' => $request->is_featured]);

            return response()->json([
                'success' => true,
                'message' => $request->is_featured ? 'Image added to featured' : 'Image removed from featured',
                'image' => $galleryImage
            ]);

        } catch (\Exception $e) {
            \Log::error('Gallery toggle featured failed', [
                'error' => $e->getMessage(),
                'image_id' => $galleryImage->id
            ]);

            return response()->json([
                'error' => 'Toggle failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete gallery image
     */
    public function destroy(GalleryImage $galleryImage): JsonResponse
    {
        try {
            // Delete the image file
            if (Storage::disk('public')->exists($galleryImage->image_path)) {
                Storage::disk('public')->delete($galleryImage->image_path);
            }

            $galleryImage->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Gallery delete failed', [
                'error' => $e->getMessage(),
                'image_id' => $galleryImage->id
            ]);

            return response()->json([
                'error' => 'Delete failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder gallery images
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'images' => 'required|array',
                'images.*' => 'integer|exists:gallery_images,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'messages' => $validator->errors()
                ], 422);
            }

            foreach ($request->input('images') as $index => $imageId) {
                GalleryImage::where('id', $imageId)
                    ->update(['sort_order' => $index + 1]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Images reordered successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Gallery reorder failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Reorder failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resize and optimize image (same as journal approach)
     */
    private function resizeImage($imagePath)
    {
        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->read(Storage::disk('public')->path($imagePath));

            // Resize to a max width of 1920 while maintaining aspect ratio
            $image->scaleDown(width: 1920);

            // Save optimized image (overwrite)
            $image->save(Storage::disk('public')->path($imagePath), quality: 80);
        } catch (\Exception $e) {
            \Log::error('Image resize error:', ['message' => $e->getMessage(), 'path' => $imagePath]);
        }
    }
}

<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;

class ImageOptimizationService
{
    private $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Generate responsive image URLs for different screen sizes
     */
    public function generateResponsiveUrls(string $imagePath, array $sizes = [320, 640, 768, 1024, 1280]): array
    {
        $urls = [];
        
        foreach ($sizes as $size) {
            $optimizedPath = $this->getOptimizedImagePath($imagePath, $size);
            
            // Check if optimized image exists, if not create it
            if (!Storage::disk('public')->exists($optimizedPath)) {
                $this->createOptimizedImage($imagePath, $size);
            }
            
            $urls[$size] = Storage::disk('public')->url($optimizedPath);
        }
        
        return $urls;
    }

    /**
     * Get the optimized image path
     */
    private function getOptimizedImagePath(string $originalPath, int $width): string
    {
        $pathInfo = pathinfo($originalPath);
        $directory = $pathInfo['dirname'];
        $filename = $pathInfo['filename'];
        $extension = $pathInfo['extension'];
        
        return "{$directory}/optimized/{$filename}_{$width}w.{$extension}";
    }

    /**
     * Create optimized image
     */
    private function createOptimizedImage(string $originalPath, int $width): bool
    {
        try {
            if (!Storage::disk('public')->exists($originalPath)) {
                return false;
            }

            $image = $this->imageManager->read(Storage::disk('public')->path($originalPath));
            
            // Resize image maintaining aspect ratio
            $image->scaleDown(width: $width);
            
            // Optimize quality based on size
            $quality = $width <= 320 ? 70 : ($width <= 640 ? 80 : 85);
            
            $optimizedPath = $this->getOptimizedImagePath($originalPath, $width);
            $optimizedDir = dirname(Storage::disk('public')->path($optimizedPath));
            
            // Create directory if it doesn't exist
            if (!is_dir($optimizedDir)) {
                mkdir($optimizedDir, 0755, true);
            }
            
            // Save optimized image
            $image->save(Storage::disk('public')->path($optimizedPath), quality: $quality);
            
            return true;
        } catch (\Exception $e) {
            \Log::error('Image optimization failed:', [
                'originalPath' => $originalPath,
                'width' => $width,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get responsive image data for frontend
     */
    public function getResponsiveImageData(string $imagePath): array
    {
        $sizes = [320, 640, 768, 1024, 1280];
        $urls = $this->generateResponsiveUrls($imagePath, $sizes);
        
        return [
            'src' => $urls[1280] ?? Storage::disk('public')->url($imagePath),
            'srcSet' => $this->generateSrcSet($urls),
            'sizes' => '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px'
        ];
    }

    /**
     * Generate srcset string
     */
    private function generateSrcSet(array $urls): string
    {
        $srcSet = [];
        foreach ($urls as $width => $url) {
            $srcSet[] = "{$url} {$width}w";
        }
        return implode(', ', $srcSet);
    }
}

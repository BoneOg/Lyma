<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class SimpleImageOptimizationService
{
    /**
     * Generate responsive image URLs for different screen sizes
     * This is a simplified version that works without GD extension
     */
    public function generateResponsiveUrls(string $imagePath, array $sizes = [320, 640, 768, 1024, 1280]): array
    {
        $urls = [];
        
        foreach ($sizes as $size) {
            // For now, we'll use the original image but with optimized loading
            // In production, you would have pre-generated optimized versions
            $urls[$size] = Storage::disk('public')->url($imagePath);
        }
        
        return $urls;
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

    /**
     * Get optimized image loading attributes
     */
    public function getOptimizedImageAttributes(string $imagePath, string $alt = '', array $options = []): array
    {
        $defaults = [
            'loading' => 'lazy',
            'decoding' => 'async',
            'fetchpriority' => 'auto'
        ];

        return array_merge($defaults, $options, [
            'src' => Storage::disk('public')->url($imagePath),
            'alt' => $alt
        ]);
    }
}

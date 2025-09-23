<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ImageOptimizationService;

class OptimizeImages extends Command
{
    protected $signature = 'images:optimize';
    protected $description = 'Optimize static images for better performance';

    public function handle(ImageOptimizationService $imageOptimizationService)
    {
        $this->info('Starting image optimization...');

        // List of static images that need optimization based on Lighthouse report
        $staticImages = [
            'assets/images/about1.webp',
            'assets/images/about2.webp', 
            'assets/images/about3.webp',
            'assets/images/about4.webp',
            'assets/images/about5.webp',
            'assets/images/chef1.webp',
            'assets/images/chef2.webp',
            'assets/images/hero.webp',
            'assets/images/scallop_beige.webp',
            'assets/images/jar_beige.webp',
            'assets/images/leaf_beige.webp',
            'assets/images/lime_beige.webp',
            'assets/images/bamboo_beige.webp',
            'assets/images/fish_beige.webp',
            'assets/images/shell_beige.webp',
            'assets/images/sugarcane_beige.webp',
            'assets/images/carabao_beige.webp',
            'assets/images/footer.webp',
            'assets/images/grapes_beige.webp',
            'assets/images/coconut_beige.webp',
            'assets/logo/lymaonly_beige.webp'
        ];

        $optimizedCount = 0;
        $errorCount = 0;

        foreach ($staticImages as $imagePath) {
            try {
                if (file_exists(public_path($imagePath))) {
                    $this->info("Optimizing: {$imagePath}");
                    
                    // Generate responsive versions
                    $responsiveData = $imageOptimizationService->getResponsiveImageData($imagePath);
                    
                    $optimizedCount++;
                } else {
                    $this->warn("Image not found: {$imagePath}");
                }
            } catch (\Exception $e) {
                $this->error("Failed to optimize {$imagePath}: " . $e->getMessage());
                $errorCount++;
            }
        }

        $this->info("Optimization complete!");
        $this->info("Optimized: {$optimizedCount} images");
        if ($errorCount > 0) {
            $this->warn("Errors: {$errorCount} images");
        }
    }
}

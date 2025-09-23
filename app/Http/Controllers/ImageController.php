<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SimpleImageOptimizationService;

class ImageController extends Controller
{
    private $imageOptimizationService;

    public function __construct(SimpleImageOptimizationService $imageOptimizationService)
    {
        $this->imageOptimizationService = $imageOptimizationService;
    }

    /**
     * Get responsive image data
     */
    public function getResponsiveImage(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $imagePath = $request->input('path');
        
        try {
            $responsiveData = $this->imageOptimizationService->getResponsiveImageData($imagePath);
            
            return response()->json($responsiveData);
        } catch (\Exception $e) {
            \Log::error('Failed to get responsive image data:', [
                'path' => $imagePath,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'src' => \Storage::disk('public')->url($imagePath),
                'srcSet' => '',
                'sizes' => '100vw'
            ]);
        }
    }
}

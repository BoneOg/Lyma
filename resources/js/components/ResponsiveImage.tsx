import React, { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallbackSrc?: string;
  isGalleryImage?: boolean;
}

interface ResponsiveImageData {
  src: string;
  srcSet: string;
  sizes: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  onLoad,
  onError,
  fallbackSrc = '/assets/images/hero.webp',
  isGalleryImage = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [responsiveData, setResponsiveData] = useState<ResponsiveImageData | null>(null);

  useEffect(() => {
    // For gallery images, try to get responsive data
    if (isGalleryImage && src) {
      fetchResponsiveImageData(src);
    }
  }, [src, isGalleryImage]);

  const fetchResponsiveImageData = async (imagePath: string) => {
    try {
      const response = await fetch(`/api/responsive-image?path=${encodeURIComponent(imagePath)}`);
      if (response.ok) {
        const data = await response.json();
        setResponsiveData(data);
      }
    } catch (error) {
      console.error('Failed to fetch responsive image data:', error);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    onError?.(e);
  };

  const currentSrc = imageError ? fallbackSrc : src;
  const imageSrcSet = responsiveData?.srcSet;
  const imageSizes = responsiveData?.sizes || sizes;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        srcSet={imageSrcSet}
        sizes={imageSizes}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default ResponsiveImage;

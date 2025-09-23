import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import SEO from '@/components/SEO';
import PatternBackground from '@/components/PatternBackground';
import ResponsiveImage from '@/components/ResponsiveImage';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryPageProps {
  footerData?: {
    restaurant_address: string;
    restaurant_email: string;
    restaurant_phone: string;
    restaurant_name: string;
  };
  galleryImages?: GalleryImage[];
}

const Gallery: React.FC<GalleryPageProps> = ({ footerData, galleryImages = [] }) => {
  const [images, setImages] = useState<GalleryImage[]>(galleryImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery-images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show non-featured images in the gallery
  const galleryImagesList = images.filter(img => !img.is_featured);

  return (
    <>
      <SEO
        title="Gallery | A Glimpse Into Lyma's World - Siargao Fine Dining Experience"
        description="Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish. Experience our journey through flavors where sustainability meets culinary excellence, featuring French techniques, Spanish influences, and Asian creativity with Filipino ingredients in General Luna, Siargao."
        keywords="Lyma gallery, glimpse into Lyma's world, restaurant photos, Siargao dining photos, fine dining gallery, food photography, flavors textures details, sustainable dining, journey through flavors, five values one vision, French techniques, Spanish influences, Asian creativity, Filipino ingredients, Siargao restaurant images, culinary excellence, visual experience, General Luna, tropical dining, island cuisine"
        image="/assets/images/gallery1.webp"
        type="restaurant.gallery"
        url="https://www.lymasiargao.com/gallery"
      />
      <Layout footerData={footerData}>
        <section className="w-full bg-olive text-beige relative overflow-hidden">
          <PatternBackground />

          {/* Header Section */}
          <div className="px-4 sm:px-6 md:px-8 py-16 sm:py-16 md:py-25 relative z-10">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <p className="font-lexend text-center tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.2rem] uppercase text-[12px] sm:text-sm font-light text-beige mb-2">
                A GLIMPSE INTO
              </p>
              <p className="font-lexend tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.2rem] uppercase text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-8xl 2xl:text-9xl font-extralight leading-tight text-beige mb-8">
                LYMA'S WORLD
              </p>
              <div className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-32 2xl:w-32 h-[1px] bg-beige mx-auto mb-8" style={{ opacity: 0.5 }} />
              <p className="font-lexend text-center font-light text-beige text-sm lg:text-lg xl:text-xl max-w-4xl mx-auto leading-relaxed">
                Discover Lyma through moments on the plate — a showcase of flavors, textures, and details captured in every dish. A glimpse into Lyma's world where sustainability meets culinary excellence, featuring our journey through flavors and five values, one vision philosophy in General Luna, Siargao.
              </p>
            </div>


            {/* Instagram-style Gallery Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4 max-w-6xl mx-auto">
                {galleryImagesList.map((image, index) => (
                  <div key={image.id} className="aspect-square overflow-hidden rounded-none shadow-lg group cursor-pointer">
                    <ResponsiveImage
                      src={image.image_path.startsWith('/storage/') ? image.image_path : `/storage/${image.image_path}`}
                      alt={image.alt_text || `Gallery image ${index + 1}`}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      isGalleryImage={true}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {galleryImagesList.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="font-lexend text-beige text-lg opacity-75">
                  Gallery images coming soon...
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Gallery;

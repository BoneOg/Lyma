import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@inertiajs/react";

interface JournalEntry {
  id: number;
  title: string;
  slug: string;
  image: string;
  published_at: string;
}

const JournalSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload image function
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Fetch journal entries from API
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/admin/api/journal-entries');
        const data = await response.json();
        setJournalEntries(data);
        
        // Preload all images
        const imagePromises = data.map((entry: JournalEntry) => {
          const imageSrc = entry.image.startsWith('http') 
            ? entry.image 
            : (entry.image.startsWith('/storage/') 
              ? entry.image 
              : `/storage/${entry.image}`);
          return preloadImage(imageSrc).catch(() => {
            // Fallback to default image if preload fails
            return preloadImage('/assets/images/hero.webp');
          });
        });
        
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        // Fallback to mock data if API fails
        const fallbackData = [
          {
            id: 1,
            title: "LYMA BEGINS: A NEW CULINARY JOURNEY",
            slug: "lyma-begins",
            image: "/assets/images/hero.webp",
            published_at: "2025-08-16"
          }
        ];
        setJournalEntries(fallbackData);
        
        // Preload fallback image
        preloadImage('/assets/images/hero.webp');
      }
    };

    fetchEntries();
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    const nextIndex = (currentSlide + 1) % journalEntries.length;
    const nextEntry = journalEntries[nextIndex];
    const nextImageSrc = nextEntry.image.startsWith('http') 
      ? nextEntry.image 
      : (nextEntry.image.startsWith('/storage/') 
        ? nextEntry.image 
        : `/storage/${nextEntry.image}`);
    
    // Only transition if the next image is loaded
    if (loadedImages.has(nextImageSrc)) {
      setIsTransitioning(true);
      setCurrentSlide(nextIndex);
      setTimeout(() => setIsTransitioning(false), 500); // Reset after animation
    }
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    const prevIndex = (currentSlide - 1 + journalEntries.length) % journalEntries.length;
    const prevEntry = journalEntries[prevIndex];
    const prevImageSrc = prevEntry.image.startsWith('http') 
      ? prevEntry.image 
      : (prevEntry.image.startsWith('/storage/') 
        ? prevEntry.image 
        : `/storage/${prevEntry.image}`);
    
    // Only transition if the previous image is loaded
    if (loadedImages.has(prevImageSrc)) {
      setIsTransitioning(true);
      setCurrentSlide(prevIndex);
      setTimeout(() => setIsTransitioning(false), 500); // Reset after animation
    }
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    
    const targetEntry = journalEntries[index];
    const targetImageSrc = targetEntry.image.startsWith('http') 
      ? targetEntry.image 
      : (targetEntry.image.startsWith('/storage/') 
        ? targetEntry.image 
        : `/storage/${targetEntry.image}`);
    
    // Only transition if the target image is loaded
    if (loadedImages.has(targetImageSrc)) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500); // Reset after animation
    }
  };

  if (journalEntries.length === 0) return null;

  const currentEntry = journalEntries[currentSlide];
  const currentImageSrc = currentEntry.image.startsWith('http') 
    ? currentEntry.image 
    : (currentEntry.image.startsWith('/storage/') 
      ? currentEntry.image 
      : `/storage/${currentEntry.image}`);
  const isImageLoaded = loadedImages.has(currentImageSrc);

  return (
    <Link href={`/journal/${currentEntry.slug}`} className="block">
      <section className="relative w-full h-screen overflow-hidden cursor-pointer group">
        {/* Link Overlay - positioned on top */}
        <div className="absolute inset-0 z-10 cursor-pointer"></div>
        
        {/* Background Image with Animation */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img 
                src={currentImageSrc} 
                alt={currentEntry.title} 
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => {
                  setLoadedImages(prev => new Set([...prev, currentImageSrc]));
                }}
                onError={(e) => {
                  console.error('Image failed to load:', currentImageSrc);
                  e.currentTarget.src = '/assets/images/hero.webp'; // Fallback image
                  setLoadedImages(prev => new Set([...prev, '/assets/images/hero.webp']));
                }}
              />
            </motion.div>
          </AnimatePresence>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
        </div>
        
        {/* Navigation Arrows - Visible on all devices */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>

        {/* Bottom Content - Display Only */}
        <div className="absolute bottom-8 left-0 right-0 z-20 px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-[8fr_1fr_4fr] gap-4 items-end group-hover:opacity-90 transition-opacity">
            {/* Title - Left Column */}
            <div className="text-beige">
              <h3 className="font-lexend text-lg sm:text-xl md:text-2xl lg:text-3xl font-extralight tracking-[0.1em] uppercase">
                {currentEntry.title}
              </h3>
            </div>
            
            {/* Empty Space - Middle Column */}
            <div></div>
            
            {/* Date - Right Column */}
            <div className="text-beige text-right">
              <p className="font-lexend text-sm sm:text-base md:text-lg lg:text-xl font-extralight tracking-[0.1em]">
                {new Date(currentEntry.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Slide Indicators - Top Center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {journalEntries.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </Link>
  );
};

export default JournalSection;
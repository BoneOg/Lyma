import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/components/layout';
import { Calendar } from 'lucide-react';
import Arrow from '@/components/Arrow';
import PatternBackground from '@/components/PatternBackground';

interface JournalEntry {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  published_at: string;
  featured: boolean;
}

interface Props {
  journalEntries: JournalEntry[];
  footerData: any;
}

const Journal: React.FC<Props> = ({ journalEntries, footerData }) => {
  const featured = journalEntries.filter(entry => entry.featured);
  // Show all entries in All Stories, including featured ones
  const allEntries = journalEntries;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => setCurrent(prev => (prev + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <Layout footerData={footerData}>
      <Head title="Journal" />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="relative h-96 bg-gradient-to-b from-olive/20 to-background overflow-hidden">
          <div className="absolute inset-0 bg-olive"></div>
          
          {/* Pattern Background */}
          <div className="absolute inset-0 z-0">
            <PatternBackground 
              overrides={{
                carabao: 'absolute top-1/4 -translate-y-1/2 left-2 lg:left-4 w-32 lg:w-52 rotate-[-10deg]',
                sugarcane: 'absolute bottom-[20%] left-[20%] w-22 lg:w-36 rotate-[-1deg] -translate-x-4',
                scallop: 'hidden lg:block absolute top-16 left-[20%] w-14 rotate-[6deg]',
                fish: 'absolute top-[35%] right-2 lg:right-8 w-20 lg:w-64 rotate-[5deg] translate-x-0 lg:translate-x-32',
                logo: 'absolute bottom-5 right-2 lg:right-0 w-24 lg:w-52 rotate-[-6deg] translate-x-0 lg:translate-x-3 translate-y-0 lg:translate-y-3',
                grapes: 'absolute bottom-0 left-2 lg:left-6 w-20 lg:w-36 rotate-[-1deg] -translate-x-0 lg:-translate-x-4'
              }}
            />
          </div>
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-thin font-lexend tracking-wider uppercase mb-4">
                Journal
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Slideshow (if 2+ featured) or single */}
          {featured.length > 0 && (
            <div className="mb-16">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light font-lexend text-olive mb-8 tracking-wide">
                Featured {featured.length > 1 ? 'Stories' : 'Story'}
              </h2>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <AnimatePresence initial={false}>
                  {featured.map((entry, idx) => (
                    idx === current && (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Link href={`/journal/${entry.slug}`} className="absolute inset-0 z-10" />
                        <img
                          src={entry.image.startsWith('/storage/') ? entry.image : `/storage/${entry.image}`}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <h3 className="text-sm sm:text-nd md:text-lg lg:text-3xl font-light font-lexend tracking-wide uppercase mb-2 max-w-[90%] leading-tight">
                            {entry.title}
                          </h3>
                          <p className="text-xs font-lexend opacity-90 mb-4 line-clamp-2">
                            {entry.excerpt}
                          </p>
                          <div className="text-sm font-lexend opacity-90">
                            {new Date(entry.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
                {/* Arrows */}
                {featured.length > 1 && (
                  <>
                    <button
                      aria-label="Previous"
                      onClick={() => setCurrent((prev) => (prev - 1 + featured.length) % featured.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => setCurrent((prev) => (prev + 1) % featured.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    {/* Indicators */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrent(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Journal Grid - Bento Layout */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-light font-lexend text-olive mb-8 tracking-wide">
              All Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEntries.map((entry) => (
                <article key={entry.id} className="group flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Image Container */}
                  <div className="relative h-64 flex-shrink-0">
                    <img 
                      src={entry.image.startsWith('/storage/') ? entry.image : `/storage/${entry.image}`}
                      alt={entry.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  
                  {/* Content Container - Flex to push CTA to bottom */}
                  <div className="flex flex-col flex-grow p-6">
                    {/* Date */}
                    <div className="flex items-center text-sm text-muted-foreground font-lexend mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(entry.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-light font-lexend tracking-wide uppercase group-hover:text-olive transition-colors mb-3 line-clamp-2">
                      <Link href={`/journal/${entry.slug}`}>
                        {entry.title}
                      </Link>
                    </h3>
                    
                    {/* Excerpt */}
                    <div className="flex-grow mb-4 overflow-hidden">
                      <p className="text-sm text-muted-foreground font-lexend line-clamp-2">
                        {entry.excerpt}
                      </p>
                    </div>
                    
                    {/* Read More CTA - Always at bottom right */}
                    <div className="flex justify-end mt-auto">
                      <Link 
                        href={`/journal/${entry.slug}`}
                        className="inline-flex items-center gap-2 font-lexend font-semibold tracking-[0.25em] text-olive uppercase text-sm"
                      >
                        Read More
                        <Arrow color="olive" size="sm" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {journalEntries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-lexend text-lg">
                No journal entries yet. Check back soon for stories from Lyma.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Journal;
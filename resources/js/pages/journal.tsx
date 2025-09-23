import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/components/layout';
import { Calendar } from 'lucide-react';
import Arrow from '@/components/Arrow';
import PatternBackground from '@/components/PatternBackground';
import SEO from '@/components/SEO';

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
  const allEntries = journalEntries;
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => setCurrent(prev => (prev + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <Layout footerData={footerData}>
      <SEO
        title="Journal | Culinary Stories & Insights - Lyma Restaurant Siargao"
        description="Discover culinary stories, insights, and behind-the-scenes moments from Lyma Restaurant in Siargao. Explore our journey through flavors, sustainable practices, and the artistry of Chef Marc's innovative techniques combining French, Spanish, and Asian influences with Filipino ingredients."
        keywords="Lyma journal, culinary stories, Siargao restaurant blog, Chef Marc insights, sustainable dining stories, French techniques, Spanish influences, Asian creativity, Filipino ingredients, culinary journey, restaurant behind the scenes, fine dining stories, General Luna, tropical cuisine, island dining"
        image="/assets/images/journal.webp"
        type="blog"
        url="https://www.lymasiargao.com/journal"
      />
      
      <div className="min-h-screen bg-olive">
        {/* Pattern Background */}
        <div className="fixed inset-0 z-0">
          <PatternBackground 
            overrides={{
              carabao: 'absolute top-1/4 -translate-y-1/2 left-2 lg:left-4 w-32 lg:w-52 rotate-[-10deg] opacity-30',
              sugarcane: 'absolute bottom-[20%] left-[20%] w-22 lg:w-36 rotate-[-1deg] -translate-x-4 opacity-30',
              scallop: 'hidden lg:block absolute top-16 left-[20%] w-14 rotate-[6deg] opacity-30',
              fish: 'absolute top-[35%] right-2 lg:right-8 w-20 lg:w-64 rotate-[5deg] translate-x-0 lg:translate-x-32 opacity-30',
              logo: 'absolute bottom-5 right-2 lg:right-0 w-24 lg:w-52 rotate-[-6deg] translate-x-0 lg:translate-x-3 translate-y-0 lg:translate-y-3 opacity-30',
              grapes: 'absolute bottom-0 left-2 lg:left-6 w-20 lg:w-36 rotate-[-1deg] -translate-x-0 lg:-translate-x-4 opacity-30'
            }}
          />
        </div>
        
        {/* Header */}
        <div className="relative h-96 overflow-hidden">
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-beige">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-thin font-lexend tracking-wider uppercase ">
                Journal
              </h1>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Section */}
          {featured.length > 0 && (
            <div className="mb-16">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light font-lexend text-beige mb-8 tracking-wide">
                Featured {featured.length > 1 ? 'Stories' : 'Story'}
              </h2>
              <div className="relative h-96 overflow-hidden rounded-none shadow-lg">
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
                        <img
                          src={entry.image.startsWith('/storage/') ? entry.image : `/storage/${entry.image}`}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          {/* Date */}
                          <div className="flex items-center text-sm font-lexend opacity-90 mb-3">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(entry.published_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold font-lexend uppercase mb-3 max-w-[90%] leading-tight">
                            {entry.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-sm font-lexend opacity-90 mb-4 line-clamp-2 max-w-[80%]">
                            {entry.excerpt}
                          </p>
                          
                          {/* Read More Button */}
                          <Link 
                            href={`/journal/${entry.slug}`}
                            className="inline-flex items-center gap-2 font-lexend font-medium tracking-widest uppercase text-sm text-beige hover:text-olive px-4 py-2 rounded-none border border-beige hover:bg-beige hover:text-olive transition-all duration-300"
                          >
                            Read More
                            <Arrow color="beige" size="sm" />
                          </Link>
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
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => setCurrent((prev) => (prev + 1) % featured.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    {/* Indicators */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrent(i)}
                          className={`w-2 h-2 rounded-none transition-colors ${i === current ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Journal Grid - All Stories */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-light font-lexend text-beige mb-8 tracking-wide">
              All Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allEntries.map((entry) => (
                <article 
                  key={entry.id} 
                  className="group flex flex-col h-full bg-beige shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-none"
                >
                  {/* Image */}
                  <div className="relative h-64 flex-shrink-0 overflow-hidden">
                    <img 
                      src={entry.image.startsWith('/storage/') ? entry.image : `/storage/${entry.image}`}
                      alt={entry.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    {/* Date */}
                    <div className="flex items-center text-sm text-olive/70 font-lexend mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(entry.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-semibold text-olive font-lexend tracking-wide uppercase mb-3 line-clamp-2 leading-tight group-hover:text-olive/90 transition-colors">
                      <Link href={`/journal/${entry.slug}`}>
                        {entry.title}
                      </Link>
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-sm text-olive/80 font-lexend line-clamp-2 leading-relaxed mb-6 flex-grow">
                      {entry.excerpt}
                    </p>
                    
                    {/* Read More CTA */}
                    <div className="mt-auto">
                      <Link 
                        href={`/journal/${entry.slug}`}
                        className="inline-flex items-center gap-2 font-lexend font-medium tracking-widest uppercase text-sm text-olive hover:text-beige px-4 py-2 rounded-none border border-olive hover:bg-olive hover:text-beige transition-all duration-300"
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
              <p className="text-white/80 font-lexend text-lg">
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

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/components/layout';
import { Calendar, ArrowLeft } from 'lucide-react';
import SharePopup from '@/components/SharePopup';
import Arrow from '@/components/Arrow';
import PatternBackground from '@/components/PatternBackground';

interface JournalEntry {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  gallery_images: string[];
  published_at: string;
  meta_title?: string;
  meta_description?: string;
}

interface Props {
  journalEntry: JournalEntry;
  relatedEntries: JournalEntry[];
  footerData: any;
}

const JournalEntry: React.FC<Props> = ({ journalEntry, relatedEntries, footerData }) => {
  return (
    <Layout footerData={footerData}>
      <Head title={journalEntry.meta_title || journalEntry.title}>
        <meta name="description" content={journalEntry.meta_description || journalEntry.excerpt} />
      </Head>
      
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
        {/* Hero Section */}
        <div className="relative z-10 h-96 sm:h-[500px] lg:h-[600px]">
          <img 
            src={journalEntry.image.startsWith('/storage/') ? journalEntry.image : `/storage/${journalEntry.image}`}
            alt={journalEntry.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center text-xs sm:text-sm font-lexend mb-2 sm:mb-4">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {new Date(journalEntry.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-5xl font-light font-lexend tracking-wide uppercase mb-2 sm:mb-4 leading-tight">
                {journalEntry.title}
              </h1>
              <p className="text-xs sm:text-lg font-lexend opacity-90 max-w-2xl">
                {journalEntry.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/journal"
              className="inline-flex items-center text-beige hover:text-beige/90 transition-colors font-lexend text-sm tracking-wide uppercase"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Link>
          </div>
          
          <div className="prose prose-lg max-w-none font-lexend">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: journalEntry.content }}
            />
          </div>

          {/* Gallery removed per admin request */}

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-border">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between">
                {/* Share Section */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-lexend text-beige tracking-wide uppercase">
                    Share this story
                  </span>
                  <SharePopup 
                    url={window.location.href}
                    title={journalEntry.title}
                    description={journalEntry.excerpt}
                    invert
                  />
                </div>
                
                {/* Back to Journal */}
                <Link 
                  href="/journal"
                  className="flex items-center text-beige hover:text-beige/90 transition-colors font-lexend text-[10px] tracking-wide uppercase"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Back to Journal
                </Link>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-lexend text-beige tracking-wide uppercase">
                  Share this story
                </span>
                <SharePopup 
                  url={window.location.href}
                  title={journalEntry.title}
                  description={journalEntry.excerpt}
                  invert
                />
              </div>
              <Link 
                href="/journal"
                className="inline-flex items-center text-beige hover:text-beige/90 transition-colors font-lexend text-sm tracking-wide uppercase"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Link>
            </div>
          </div>
        </div>

        {/* Related Entries */}
        {relatedEntries.length > 0 && (
          <div className="bg-muted/30 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-light font-lexend text-olive mb-8 tracking-wide uppercase text-center">
                Related Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedEntries.map((entry) => (
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JournalEntry;

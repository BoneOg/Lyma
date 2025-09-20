import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/components/layout';
import { Calendar, ArrowLeft } from 'lucide-react';
import SharePopup from '@/components/SharePopup';
import Arrow from '@/components/Arrow';

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
      <Head 
        title={journalEntry.meta_title || journalEntry.title}
        meta={[
          { name: 'description', content: journalEntry.meta_description || journalEntry.excerpt }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
          <img 
            src={journalEntry.image.startsWith('/storage/') ? journalEntry.image : `/storage/${journalEntry.image}`}
            alt={journalEntry.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center text-sm font-lexend mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(journalEntry.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-lexend tracking-wide uppercase mb-4">
                {journalEntry.title}
              </h1>
              <p className="text-lg font-lexend opacity-90 max-w-2xl">
                {journalEntry.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/journal"
              className="inline-flex items-center text-olive hover:text-olive-dark transition-colors font-lexend text-sm tracking-wide uppercase"
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
              <div className="space-y-4">
                {/* Back to Journal - Full width button */}
                <Link 
                  href="/journal"
                  className="w-full flex items-center justify-center py-3 px-4 bg-olive text-beige hover:bg-olive-dark transition-colors font-lexend text-sm tracking-wide uppercase rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Journal
                </Link>
                
                {/* Share Section */}
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-sm font-lexend text-muted-foreground tracking-wide uppercase">
                    Share this story
                  </span>
                  <SharePopup 
                    url={window.location.href}
                    title={journalEntry.title}
                    description={journalEntry.excerpt}
                  />
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-lexend text-muted-foreground tracking-wide uppercase">
                  Share this story
                </span>
                <SharePopup 
                  url={window.location.href}
                  title={journalEntry.title}
                  description={journalEntry.excerpt}
                />
              </div>
              <Link 
                href="/journal"
                className="inline-flex items-center text-olive hover:text-olive-dark transition-colors font-lexend text-sm tracking-wide uppercase"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEntries.map((entry) => (
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
                      <h4 className="text-base sm:text-lg md:text-xl font-light font-lexend tracking-wide uppercase group-hover:text-olive transition-colors mb-3 line-clamp-2">
                        <Link href={`/journal/${entry.slug}`}>
                          {entry.title}
                        </Link>
                      </h4>
                      
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JournalEntry;

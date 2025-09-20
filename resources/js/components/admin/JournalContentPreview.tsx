import React from 'react';

interface JournalContentPreviewProps {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  className?: string;
}

const JournalContentPreview: React.FC<JournalContentPreviewProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`h-full bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Preview Header */}
      <div className="bg-gray-50 px-4 py-8 border-b border-gray-200">
        <h3 className="text-2xl text-gray-700 font-medium">Live Preview</h3>
      </div>
      
      {/* Preview Content */}
      <div className="h-full overflow-y-auto">
        <article className="max-w-4xl mx-auto p-6">
          {/* Journal Content Only */}
          {content && (
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          
          {/* Empty State */}
          {!content && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Start writing to see your preview here</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default JournalContentPreview;

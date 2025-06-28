import React from 'react';

interface BlankContainerProps {
  title: string;
}

const BlankContainer: React.FC<BlankContainerProps> = ({ title }) => {
  return (
    <div className="bg-white rounded-4xl shadow-lg p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl text-[#3f411a] font-lexend font-extralight">{title}</h2>
      </div>
      
      <div className="space-y-8">
        {/* Empty content area */}
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 font-lexend font-extralight">Content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default BlankContainer; 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Copy, 
  X, 
  Share2,
  Check
} from 'lucide-react';

interface SharePopupProps {
  url: string;
  title: string;
  description?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ url, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    url,
    title,
    text: description || title
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'hover:bg-pink-600',
      action: () => {
        // Instagram doesn't support direct URL sharing, so we'll copy the URL
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'Twitter/X',
      icon: X,
      color: 'hover:bg-black',
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: 'hover:bg-gray-600',
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="p-2 rounded-full bg-olive text-beige hover:bg-olive-dark transition-colors"
        aria-label="Share this story"
      >
        <Share2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-0 z-50 bg-white rounded-lg shadow-lg border border-border p-4 min-w-[200px]"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-lexend font-medium text-gray-900 mb-3 text-center">
                  Share this story
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => {
                        option.action();
                        if (option.name !== 'Copy Link') {
                          setIsOpen(false);
                        }
                      }}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors ${option.color} text-white hover:scale-105`}
                      style={{ backgroundColor: option.name === 'Copy Link' ? (copied ? '#10b981' : '#6b7280') : undefined }}
                    >
                      <option.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-lexend font-medium">
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-green-600 font-lexend"
                  >
                    Link copied!
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SharePopup;

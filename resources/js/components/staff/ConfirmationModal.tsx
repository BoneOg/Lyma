import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'complete' | 'cancel';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-[#3f411a] text-white rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl mb-4 font-lexend font-extralight">{title}</h3>
        <p className="text-[#f6f5c6] mb-6 font-lexend font-extralight">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-red-200 hover:bg-red-300 text-red-900 border-red-400 border-2 py-3 px-4 rounded-md font-extralight transition-colors font-lexend"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-200 hover:bg-green-300 text-green-900 border-green-400 border-2 py-3 px-4 rounded-md font-extralight transition-colors font-lexend"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 
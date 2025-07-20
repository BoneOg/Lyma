import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'complete' | 'cancel';
  reservationName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  reservationName
}) => {
  const getTitle = () => {
    return action === 'complete' 
      ? 'Complete Reservation' 
      : 'Cancel Reservation';
  };

  const getMessage = () => {
    return action === 'complete'
      ? <>Are you sure you want to <span className="font-bold text-green-700 ">complete</span> the reservation for <span className="font-bold ">{reservationName}</span>?</>
      : <>Are you sure you want to <span className="font-bold text-red-700 ">cancel</span> the reservation for <span className="font-bold">{reservationName}</span>?</>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-background text-olive rounded p-6 shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl mb-4 font-lexend font-semibold tracking-tighter">{getTitle()}</h3>
        <p className="text-olive mb-6 font-lexend font-light tracking-tight">{getMessage()}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.8)] text-white border-none py-3 px-4 rounded font-regular transition-colors font-lexend cursor-pointer"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-olive hover:bg-olive-light text-white border-none py-3 px-4 rounded font-regular transition-colors font-lexend cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 
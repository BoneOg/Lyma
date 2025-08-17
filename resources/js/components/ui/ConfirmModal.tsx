import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  onCancel,
  onConfirm,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  children,
  confirmDisabled = false,
  cancelDisabled = false,
  variant = 'default',
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onCancel]);

  if (!open) return null;

  const getVariantConfig = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: AlertTriangle,
          iconColor: '#ef4444',
          confirmBg: '#ef4444',
          confirmHoverBg: '#dc2626',
          iconBg: '#fef2f2',
          borderColor: '#fecaca'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: '#22c55e',
          confirmBg: '#22c55e',
          confirmHoverBg: '#16a34a',
          iconBg: '#f0fdf4',
          borderColor: '#bbf7d0'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: '#f59e0b',
          confirmBg: '#f59e0b',
          confirmHoverBg: '#d97706',
          iconBg: '#fffbeb',
          borderColor: '#fed7aa'
        };
      default:
        return {
          icon: CheckCircle,
          iconColor: 'var(--color-olive)',
          confirmBg: 'var(--color-olive)',
          confirmHoverBg: 'var(--color-olive)',
          iconBg: 'var(--color-beige)',
          borderColor: 'var(--color-olive)'
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
        <div 
          className="relative bg-white shadow-2xl max-w-md w-full mx-2 sm:mx-4 transform transition-all duration-300 scale-100"
          style={{ 
            backgroundColor: 'var(--color-beige)',
            borderRadius: '0px',
            border: `1px solid ${config.borderColor}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Content */}
          <div className="p-4 sm:p-8 text-center">
            {/* Icon */}
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center"
              style={{ backgroundColor: 'transparent' }}
            >
              <IconComponent 
                className="w-8 h-8 sm:w-12 sm:h-12" 
                style={{ color: config.iconColor }} 
              />
            </div>

            {/* Title */}
            <h3 
              className="text-lg sm:text-2xl font-lexend font-medium mb-2 sm:mb-3 leading-tight"
              style={{ 
                color: 'var(--color-olive)',
                letterSpacing: '0.05em'
              }}
            >
              {title}
            </h3>

            {/* Message */}
            {message && (
              <p 
                className="text-sm sm:text-base font-lexend font-light mb-4 sm:mb-6 leading-relaxed max-w-sm mx-auto"
                style={{ 
                  color: 'var(--color-olive)',
                  opacity: '0.8'
                }}
              >
                {message}
              </p>
            )}

            {/* Children Content */}
            {children && (
              <div className="text-left mb-4 sm:mb-6 p-3 sm:p-4 bg-black/5">
                {children}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={onCancel}
                disabled={cancelDisabled}
                className="flex-1 py-2.5 sm:py-3.5 px-4 sm:px-6 font-lexend font-light text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'transparent',
                  color: cancelDisabled ? 'hsl(var(--muted-foreground))' : 'var(--color-olive)',
                  letterSpacing: '0.05em',
                  border: '1px solid var(--color-olive)',
                  opacity: cancelDisabled ? '0.5' : '1'
                }}
              >
                {cancelText}
              </button>
              
              <button
                onClick={onConfirm}
                disabled={confirmDisabled}
                className="flex-1 py-2.5 sm:py-3.5 px-4 sm:px-6 font-lexend font-light text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: confirmDisabled ? '#d1d5db' : config.confirmBg,
                  color: 'white',
                  letterSpacing: '0.05em',
                  border: 'none',
                  borderRadius: '0px',
                  boxShadow: confirmDisabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  if (!confirmDisabled) {
                    e.currentTarget.style.backgroundColor = config.confirmHoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!confirmDisabled) {
                    e.currentTarget.style.backgroundColor = config.confirmBg;
                  }
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
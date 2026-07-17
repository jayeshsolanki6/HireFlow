import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full m-4',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-xl w-full shadow-xl overflow-hidden flex flex-col max-h-[90vh] relative ${sizeMap[size]}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors z-10">
          <X className="w-5 h-5" />
        </button>
        
        {(title || description) && (
          <div className="px-6 py-5 border-b border-[var(--color-hairline)]">
            {title && <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>}
            {description && <p className="text-sm text-[var(--color-ink-subtle)] mt-1">{description}</p>}
          </div>
        )}
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

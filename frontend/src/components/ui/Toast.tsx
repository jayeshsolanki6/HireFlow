import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, title, description, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-[var(--color-surface-1)] border border-[var(--color-hairline-strong)] rounded-lg shadow-lg max-w-sm w-full relative overflow-hidden pointer-events-auto">
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 pr-6">
        <h4 className="text-sm font-medium text-[var(--color-ink)]">{title}</h4>
        {description && <p className="text-xs text-[var(--color-ink-subtle)] mt-1 leading-relaxed">{description}</p>}
      </div>
      <button onClick={() => onClose(id)} className="absolute top-4 right-3 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
};

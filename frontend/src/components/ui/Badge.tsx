import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'outline' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-[var(--color-hairline)]',
    primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'bg-transparent text-[var(--color-ink-subtle)] border border-[var(--color-hairline)]'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

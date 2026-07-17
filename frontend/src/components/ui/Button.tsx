import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  size = 'md',
  children,
  className = '',
  variant = 'secondary',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };
  const baseStyles = `inline-flex items-center justify-center gap-2 font-sans font-medium tracking-normal rounded-md transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-focus/50 disabled:opacity-50 disabled:pointer-events-none ${sizeStyles[size]}`;
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-focus)]',
    secondary: 'bg-[var(--color-surface-1)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-hairline-strong)] active:bg-[var(--color-surface-3)]',
    tertiary: 'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-1)] active:bg-[var(--color-surface-2)]',
    inverse: 'bg-[var(--color-inverse-canvas)] text-[var(--color-inverse-ink)] hover:bg-[var(--color-ink-muted)] active:bg-[var(--color-ink-subtle)]',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 active:bg-red-200'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

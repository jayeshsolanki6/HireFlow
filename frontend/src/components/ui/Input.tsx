import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  helperText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ leftIcon, rightIcon, error, label, helperText, className = '', ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[var(--color-ink)]">{label}</label>}
      <div className="relative flex items-center">
        {leftIcon && <div className="absolute left-3 text-[var(--color-ink-subtle)] pointer-events-none">{leftIcon}</div>}
        <input
          ref={ref}
          className={`flex h-9 w-full rounded-md border ${error ? 'border-red-500' : 'border-[var(--color-hairline-strong)]'} bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-ink-subtle)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''} ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 text-[var(--color-ink-subtle)] pointer-events-none">{rightIcon}</div>}
      </div>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      {!error && helperText && <p className="mt-1 text-[10px] text-[var(--color-ink-subtle)]">{helperText}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ error, label, helperText, className = '', ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[var(--color-ink)]">{label}</label>}
      <textarea
        ref={ref}
        className={`flex min-h-[60px] w-full rounded-md border ${error ? 'border-red-500' : 'border-[var(--color-hairline-strong)]'} bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[var(--color-ink-subtle)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      {!error && helperText && <p className="mt-1 text-[10px] text-[var(--color-ink-subtle)]">{helperText}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: {value: string; label: string}[];
  error?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ error, label, helperText, options, className = '', children, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[var(--color-ink)]">{label}</label>}
      <select
        ref={ref}
        className={`flex h-9 w-full items-center justify-between rounded-md border ${error ? 'border-red-500' : 'border-[var(--color-hairline-strong)]'} bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-[var(--color-ink-subtle)] focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {options ? options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )) : children}
      </select>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      {!error && helperText && <p className="mt-1 text-[10px] text-[var(--color-ink-subtle)]">{helperText}</p>}
    </div>
  );
});
Select.displayName = 'Select';

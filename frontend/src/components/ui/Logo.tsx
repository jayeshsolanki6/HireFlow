import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const svgSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base md:text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      <div className={`${iconSizes[size]} shrink-0 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm border border-slate-800/40 relative overflow-hidden`}>
        <svg 
          width={svgSizes[size]} 
          height={svgSizes[size]} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 12H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 18H10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="15" r="4.5" fill="#10B981" />
          <path d="M16.2 15L17.4 16.2L19.8 13.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold tracking-tight text-[var(--color-ink)] ${textSizes[size]}`}>
          Short<span className="text-[var(--color-primary)]">list</span>
        </span>
      )}
    </div>
  );
};

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', isHoverable, ...props }) => {
  return (
    <div className={`bg-[var(--color-surface-1)] border border-[var(--color-hairline)] rounded-xl overflow-hidden ${isHoverable ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

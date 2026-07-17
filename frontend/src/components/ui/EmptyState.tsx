import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionLabel, 
  onAction, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface-1)] border border-[var(--color-hairline)] border-dashed rounded-xl ${className}`}>
      {icon && <div className="mb-4 text-[var(--color-ink-muted)]">{icon}</div>}
      <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-1">{title}</h3>
      {description && <p className="text-xs text-[var(--color-ink-subtle)] max-w-sm mx-auto mb-4">{description}</p>}
      {action && <div>{action}</div>}
      {actionLabel && onAction && (
        <div className="mt-2">
          <Button onClick={onAction} variant="secondary">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};

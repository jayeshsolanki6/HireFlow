import React from 'react';

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function Table<T extends { id?: string | number }>({ data, columns, keyExtractor, onRowClick, isLoading, emptyState }: TableProps<T>) {
  if (isLoading) {
    return <div className="p-8 text-center text-sm text-[var(--color-ink-subtle)]">Loading...</div>;
  }

  if (data.length === 0 && emptyState) {
    return <div className="p-4">{emptyState}</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-[var(--color-ink-muted)] bg-[var(--color-surface-2)] border-y border-[var(--color-hairline)]">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-4 py-3 font-medium text-${col.align || 'left'} ${col.width || ''} ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-hairline)] bg-[var(--color-surface-1)]">
          {data.map((item, i) => {
            const rowKey = keyExtractor ? keyExtractor(item) : (item.id ? String(item.id) : i.toString());
            return (
              <tr key={rowKey} onClick={() => onRowClick?.(item)} className={`${onRowClick ? 'cursor-pointer hover:bg-[var(--color-surface-2)] transition-colors' : ''}`}>
                {columns.map((col, j) => (
                  <td key={j} className={`px-4 py-3 text-${col.align || 'left'} ${col.className || ''}`}>
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item as any)[col.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

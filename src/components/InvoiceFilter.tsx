import React from 'react';
import type { InvoiceStatus } from '../types/invoice';

interface FilterProps {
  currentFilter: InvoiceStatus | 'all';
  onFilterChange: (filter: InvoiceStatus | 'all') => void;
}

export const InvoiceFilter: React.FC<FilterProps> = ({ currentFilter, onFilterChange }) => {
  const filters: Array<{ value: InvoiceStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentFilter === filter.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          }`}
          aria-pressed={currentFilter === filter.value}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

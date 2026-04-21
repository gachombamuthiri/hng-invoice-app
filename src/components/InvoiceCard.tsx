import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Invoice } from '../types/invoice';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

interface InvoiceCardProps {
  invoice: Invoice;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const total = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className="block group"
    >
      <div className="card hover:shadow-md transform hover:scale-[1.02] cursor-pointer mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {invoice.invoiceNumber}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {invoice.clientName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {formatDate(invoice.issueDate)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(total)}
              </p>
            </div>
            <StatusBadge status={invoice.status} />
            <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </Link>
  );
};

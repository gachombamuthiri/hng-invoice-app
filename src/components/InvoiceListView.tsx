import React, { useState } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceFilter } from './InvoiceFilter';
import { InvoiceCard } from './InvoiceCard';

export const InvoiceListView: React.FC = () => {
  const {  invoices, filter, setFilter } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBySearch = invoices.filter(
    inv =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Invoices
        </h2>

        <div className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search by invoice number or client name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field"
            aria-label="Search invoices"
          />

          <InvoiceFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      {filteredBySearch.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            No invoices found
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Create your first invoice to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBySearch.map(invoice => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
};

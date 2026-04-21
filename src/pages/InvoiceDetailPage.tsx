import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { Invoice } from '../types/invoice';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useInvoices } from '../hooks/useInvoices';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useState } from 'react';

export const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, deleteInvoice, updateStatus } = useInvoices();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const invoice = id ? getInvoiceById(id) : null;

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
          Invoice not found
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
        >
          ← Back to Invoices
        </button>
      </div>
    );
  }

  const total = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      deleteInvoice(invoice.id);
      navigate('/');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (newStatus: Invoice['status']) => {
    if (newStatus !== invoice.status) {
      updateStatus(invoice.id, newStatus);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Back to invoices"
          >
            <ArrowLeft className="text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {invoice.clientName}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit size={20} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger flex items-center gap-2 hover:opacity-90"
          >
            <Trash2 size={20} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Status Section */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Current Status</p>
            <StatusBadge status={invoice.status} />
          </div>

          {invoice.status !== 'paid' && (
            <div className="flex gap-2">
              {invoice.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('pending')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Mark as Pending
                </button>
              )}
              {invoice.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('paid')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Details */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Invoice Details
          </h2>

          <div className="space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Issue Date
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(invoice.issueDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Due Date
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            {/* Client Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Client Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-white">{invoice.clientName}</p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.clientEmail}</p>
                {invoice.clientPhone && (
                  <p className="text-gray-600 dark:text-gray-400">{invoice.clientPhone}</p>
                )}
                {invoice.clientAddress && (
                  <p className="text-gray-600 dark:text-gray-400">{invoice.clientAddress}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Notes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Summary
          </h2>

          <div className="space-y-4">
            {invoice.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.description} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.quantity * item.price)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Line Items
        </h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Description
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Qty
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Price
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(item => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {item.description}
                </td>
                <td className="text-center py-3 px-4 text-gray-900 dark:text-white">
                  {item.quantity}
                </td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                  {formatCurrency(item.price)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

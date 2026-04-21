import { useState, useCallback, useEffect } from 'react';
import type { Invoice, InvoiceStatus } from '../types/invoice';
import { storage } from '../utils/storage';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');

  // Load invoices from storage on mount
  useEffect(() => {
    const loadedInvoices = storage.getInvoices();
    setInvoices(loadedInvoices);
    setLoading(false);
  }, []);

  const filteredInvoices = useCallback(() => {
    if (filter === 'all') {
      return invoices;
    }
    return invoices.filter(inv => inv.status === filter);
  }, [invoices, filter]);

  const addInvoice = useCallback((invoice: Invoice) => {
    const updated = [...invoices, invoice];
    setInvoices(updated);
    storage.addInvoice(invoice);
  }, [invoices]);

  const updateInvoice = useCallback((id: string, updatedInvoice: Invoice) => {
    const updated = invoices.map(inv => (inv.id === id ? updatedInvoice : inv));
    setInvoices(updated);
    storage.updateInvoice(id, updatedInvoice);
  }, [invoices]);

  const deleteInvoice = useCallback((id: string) => {
    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    storage.deleteInvoice(id);
  }, [invoices]);

  const getInvoiceById = useCallback(
    (id: string) => invoices.find(inv => inv.id === id),
    [invoices]
  );

  const updateStatus = useCallback((id: string, newStatus: InvoiceStatus) => {
    const invoice = getInvoiceById(id);
    if (invoice) {
      const updated = {
        ...invoice,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      updateInvoice(id, updated);
    }
  }, [getInvoiceById, updateInvoice]);

  return {
    invoices: filteredInvoices(),
    allInvoices: invoices,
    loading,
    filter,
    setFilter,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    updateStatus,
  };
};

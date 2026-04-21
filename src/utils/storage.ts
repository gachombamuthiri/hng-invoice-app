import type { Invoice } from '../types/invoice';

const INVOICES_STORAGE_KEY = 'invoices_db';
const THEME_STORAGE_KEY = 'theme_preference';

export const storage = {
  // Invoice operations
  getInvoices: (): Invoice[] => {
    try {
      const data = localStorage.getItem(INVOICES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading invoices from storage:', error);
      return [];
    }
  },

  saveInvoices: (invoices: Invoice[]): void => {
    try {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices to storage:', error);
    }
  },

  getInvoiceById: (id: string): Invoice | null => {
    const invoices = storage.getInvoices();
    return invoices.find(inv => inv.id === id) || null;
  },

  addInvoice: (invoice: Invoice): void => {
    const invoices = storage.getInvoices();
    invoices.push(invoice);
    storage.saveInvoices(invoices);
  },

  updateInvoice: (id: string, updatedInvoice: Invoice): void => {
    const invoices = storage.getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices[index] = updatedInvoice;
      storage.saveInvoices(invoices);
    }
  },

  deleteInvoice: (id: string): void => {
    const invoices = storage.getInvoices();
    storage.saveInvoices(invoices.filter(inv => inv.id !== id));
  },

  clearAll: (): void => {
    localStorage.removeItem(INVOICES_STORAGE_KEY);
  },

  // Theme operations
  getTheme: (): 'light' | 'dark' => {
    try {
      const theme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
      if (theme) return theme;

      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch (error) {
      console.error('Error reading theme from storage:', error);
      return 'light';
    }
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  },
};

import type { Invoice, InvoiceItem } from '../types/invoice';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateTotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return calculateTotal(items);
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const getStatusColor = (status: Invoice['status']): string => {
  const colors = {
    draft: 'text-yellow-600 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900',
    pending: 'text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900',
    paid: 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900',
  };
  return colors[status];
};

export const getStatusBadgeClass = (status: Invoice['status']): string => {
  const classes = {
    draft: 'badge-draft',
    pending: 'badge-pending',
    paid: 'badge-paid',
  };
  return classes[status];
};

export const daysUntilDue = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

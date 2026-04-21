export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
}

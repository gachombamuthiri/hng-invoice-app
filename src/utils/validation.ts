import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  price: z.number().positive('Price must be greater than 0'),
});

export const InvoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(50),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

export type InvoiceFormSchemaType = z.infer<typeof InvoiceFormSchema>;

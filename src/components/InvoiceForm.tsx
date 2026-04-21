import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import type { Invoice } from '../types/invoice';
import { InvoiceFormSchema } from '../utils/validation';
import type { InvoiceFormSchemaType } from '../utils/validation';
import { FormInput } from './FormInput';
import { generateId } from '../utils/helpers';

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: Invoice) => void;
  isLoading?: boolean;
}

export const InvoiceFormComponent: React.FC<InvoiceFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<InvoiceFormSchemaType>({
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues: initialData
      ? {
          invoiceNumber: initialData.invoiceNumber,
          clientName: initialData.clientName,
          clientEmail: initialData.clientEmail,
          clientPhone: initialData.clientPhone || '',
          clientAddress: initialData.clientAddress || '',
          issueDate: initialData.issueDate,
          dueDate: initialData.dueDate,
          items: initialData.items,
          notes: initialData.notes || '',
        }
      : {
          invoiceNumber: `INV-${Date.now()}`,
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientAddress: '',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [{ id: generateId(), description: '', quantity: 1, price: 0 }],
          notes: '',
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleFormSubmit = (data: InvoiceFormSchemaType) => {
    const invoice: Invoice = {
      id: initialData?.id || generateId(),
      ...data,
      status: initialData?.status || 'draft',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {initialData ? 'Edit Invoice' : 'Create Invoice'}
        </h2>

        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormInput
            label="Invoice Number"
            {...register('invoiceNumber')}
            error={errors.invoiceNumber}
            required
            disabled
          />
          <FormInput
            label="Issue Date"
            type="date"
            {...register('issueDate')}
            error={errors.issueDate}
            required
          />
        </div>

        {/* Client Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Client Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Client Name"
              {...register('clientName')}
              error={errors.clientName}
              required
            />
            <FormInput
              label="Email"
              type="email"
              {...register('clientEmail')}
              error={errors.clientEmail}
              required
            />
            <FormInput
              label="Phone"
              type="tel"
              {...register('clientPhone')}
              error={errors.clientPhone}
            />
            <FormInput
              label="Address"
              {...register('clientAddress')}
              error={errors.clientAddress}
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Items
          </h3>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end">
                <FormInput
                  label={index === 0 ? 'Description' : ''}
                  {...register(`items.${index}.description`)}
                  error={errors.items?.[index]?.description}
                  required
                  className="md:flex-1"
                />
                <FormInput
                  label={index === 0 ? 'Quantity' : ''}
                  type="number"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.quantity}
                  required
                  className="md:w-24"
                />
                <FormInput
                  label={index === 0 ? 'Price' : ''}
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.price`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.price}
                  required
                  className="md:w-32"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="error-text mt-2">{errors.items.message}</p>
          )}

          <button
            type="button"
            onClick={() => append({ id: generateId(), description: '', quantity: 1, price: 0 })}
            className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Due Date and Notes */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormInput
              label="Due Date"
              type="date"
              {...register('dueDate')}
              error={errors.dueDate}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={4}
              className="input-field"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-8">
          <div className="flex justify-end items-center gap-4">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Total:
            </span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </form>
  );
};

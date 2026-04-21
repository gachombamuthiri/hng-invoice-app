import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceFormComponent } from '../components/InvoiceForm';
import { useInvoices } from '../hooks/useInvoices';
import type { Invoice } from '../types/invoice';

export const InvoiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, addInvoice, updateInvoice } = useInvoices();
  const [isLoading, setIsLoading] = useState(false);

  const initialData = id && id !== 'new' ? getInvoiceById(id) : undefined;

  const handleSubmit = async (invoice: Invoice) => {
    setIsLoading(true);
    try {
      if (initialData) {
        updateInvoice(initialData.id, invoice);
      } else {
        addInvoice(invoice);
      }
      navigate(`/invoices/${invoice.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoiceFormComponent
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

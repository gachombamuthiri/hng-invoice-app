import React from 'react';
import type { Invoice } from '../types/invoice';
import { getStatusBadgeClass } from '../utils/helpers';

interface StatusBadgeProps {
  status: Invoice['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeClass = getStatusBadgeClass(status);
  const labelMap = {
    draft: 'Draft',
    pending: 'Pending',
    paid: 'Paid',
  };

  return (
    <span className={`badge ${badgeClass}`}>
      {labelMap[status]}
    </span>
  );
};

import React from 'react';
import { FormStatus } from '@/types/travel-form';

const statusConfig: Record<FormStatus, { label: string; classes: string }> = {
  Draft: {
    label: 'Draft',
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  Pending: {
    label: 'Pending Approval',
    classes: 'bg-[#EAB308]/15 text-yellow-700 border-[#EAB308]/40',
  },
  FinanceApproved: {
    label: 'Finance Approved',
    classes: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  Approved: {
    label: 'Approved',
    classes: 'bg-green-100 text-green-700 border-green-200',
  },
  Rejected: {
    label: 'Rejected',
    classes: 'bg-red-100 text-red-700 border-red-200',
  },
};

export function StatusBadge({ status }: { status: FormStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

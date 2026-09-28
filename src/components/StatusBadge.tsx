import React from 'react';
import { BookingStatus } from '../types/index.js';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (st: BookingStatus) => {
    switch (st) {
      case 'Pending':
        return {
          label: 'Pending',
          symbol: '○',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'Confirmed':
        return {
          label: 'Confirmed',
          symbol: '●',
          classes: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      case 'Sample Collected':
        return {
          label: 'Sample Collected',
          symbol: '◉',
          classes: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'Testing':
        return {
          label: 'Testing in Lab',
          symbol: '◐',
          classes: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'Report Ready':
        return {
          label: 'Report Ready',
          symbol: '✓',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'Completed':
        return {
          label: 'Completed',
          symbol: '✓',
          classes: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'Cancelled':
        return {
          label: 'Cancelled',
          symbol: '✕',
          classes: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      default:
        return {
          label: st,
          symbol: '·',
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${config.classes} ${className} whitespace-nowrap`}
    >
      <span className="font-mono text-[11px]" aria-hidden="true">{config.symbol}</span>
      <span>{config.label}</span>
    </span>
  );
};

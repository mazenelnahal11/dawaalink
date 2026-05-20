import React from 'react';

export type SwapStatus = 
  | 'PENDING'
  | 'PARTIAL_ACCEPT'
  | 'CONFIRMED'
  | 'IN_TRANSFER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'TIMED_OUT'
  | 'SUSPENDED'
  | 'ACTIVE'
  | 'FLAGGED';

type Props = { status: SwapStatus };

const STATUS_MAP: Record<SwapStatus, string> = {
  PENDING:         "bg-primary-fixed text-on-primary-fixed-variant",
  PARTIAL_ACCEPT:  "bg-secondary-container text-on-secondary-container",
  CONFIRMED:       "bg-primary-fixed text-primary",
  IN_TRANSFER:     "bg-tertiary-fixed text-tertiary",
  COMPLETED:       "bg-green-100 text-green-700",
  CANCELLED:       "bg-error-container text-error",
  TIMED_OUT:       "bg-surface-container-highest text-on-surface-variant",
  SUSPENDED:       "bg-error-container text-on-error-container",
  ACTIVE:          "bg-green-100 text-green-700",
  FLAGGED:         "bg-error-container text-on-error-container",
};

export const StatusChip: React.FC<Props> = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-label ${STATUS_MAP[status] || ""}`}>
      {status.replace("_", " ")}
    </span>
  );
};

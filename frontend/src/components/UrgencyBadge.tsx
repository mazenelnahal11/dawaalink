import React from 'react';

type Props = {
  daysToExpiry: number;
  showDays?: boolean;
};

export const UrgencyBadge: React.FC<Props> = ({ daysToExpiry, showDays = true }) => {
  const getUrgency = (days: number) => {
    if (days < 30)  return { label: "URGENT",  classes: "bg-error-container text-error" };
    if (days < 60)  return { label: "WARNING", classes: "bg-tertiary-fixed text-tertiary" };
    if (days < 90)  return { label: "MONITOR", classes: "bg-surface-container-high text-on-surface-variant" };
    return null;
  };

  const urgency = getUrgency(daysToExpiry);
  if (!urgency) return null;

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-label ${urgency.classes}`}>
      {showDays ? `${urgency.label} — ${daysToExpiry} Days Left` : urgency.label}
    </span>
  );
};

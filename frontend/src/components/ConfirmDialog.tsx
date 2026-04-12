import React from 'react';

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const btnConfirmClasses = variant === 'danger' 
    ? 'bg-error text-on-error hover:opacity-90' 
    : 'bg-primary text-on-primary hover:shadow-primary';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        role="dialog" 
        className="bg-surface-container-lowest rounded-2xl p-8 shadow-card-hover max-w-md w-full animate-in fade-in zoom-in-95 duration-200"
      >
        <h3 className="text-xl font-bold font-headline text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-8">{message}</p>
        
        <div className="flex justify-end gap-3 font-label">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 ${btnConfirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { useNavigate } from 'react-router-dom';

export const NotificationContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();
  const navigate = useNavigate();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'ALERT';
        const colorClass = isError ? 'border-error text-error' : 'border-primary text-primary';
        const iconInfo = toast.type === 'MATCH' ? 'sync_alt' : (isError ? 'error' : 'notifications');

        return (
          <div 
            key={toast.id} 
            className={`bg-surface-container-lowest shadow-card-hover rounded-2xl p-4 pr-10 border-l-4 ${colorClass} animate-in slide-in-from-right w-80 pointer-events-auto relative`}
          >
            <button 
              onClick={() => removeToast(toast.id)}
              className="absolute top-2 right-2 text-outline-variant hover:text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]" data-icon="close">close</span>
            </button>
            
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined shrink-0 mt-0.5" data-icon={iconInfo}>{iconInfo}</span>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-on-surface font-headline">{toast.title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5 font-body leading-relaxed">{toast.message}</p>
                {toast.link && (
                  <button 
                    onClick={() => {
                      navigate(toast.link!);
                      removeToast(toast.id);
                    }}
                    className="text-xs font-bold font-label uppercase tracking-widest mt-2 hover:underline"
                  >
                    View Details →
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

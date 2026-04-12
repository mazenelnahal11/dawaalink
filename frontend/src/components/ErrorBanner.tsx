import React from 'react';

type Props = {
  message: string;
  onRetry?: () => void;
};

export const ErrorBanner: React.FC<Props> = ({ message, onRetry }) => {
  return (
    <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3 w-full animate-in fade-in">
      <span className="material-symbols-outlined shrink-0" data-icon="error">error</span>
      <div className="flex-1 font-body text-sm">
        <p className="leading-relaxed">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="mt-2 text-on-error-container font-bold underline hover:no-underline font-label uppercase text-xs tracking-wider"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

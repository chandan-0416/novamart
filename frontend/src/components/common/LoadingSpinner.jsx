import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="animate-spin text-violet-600" size={36} />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-red-100 rounded-2xl shadow-sm text-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
        <span className="text-xl font-bold">!</span>
      </div>
      <p className="text-sm font-semibold text-slate-800 mb-4">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

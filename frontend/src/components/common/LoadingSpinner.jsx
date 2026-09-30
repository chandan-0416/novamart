import React from 'react';
import { Loader2 } from 'lucide-react';
import './Common.css';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <Loader2 className="spinner-icon animate-spin" size={36} />
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-card glass-card">
      <p className="error-text">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm">
          Retry
        </button>
      )}
    </div>
  );
};

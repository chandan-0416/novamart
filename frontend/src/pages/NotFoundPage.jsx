import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-xs mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-500/20 transition-all"
      >
        <ArrowLeft size={16} />
        <span>Return to Catalog</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

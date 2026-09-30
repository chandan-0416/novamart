import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import './Pages.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page glass-card animate-fade-in">
      <div className="not-found-icon-box">
        <AlertTriangle size={48} />
      </div>
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-desc">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={18} />
        <span>Return to Catalog</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

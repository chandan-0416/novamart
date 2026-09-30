import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Common.css';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and adjacent pages
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination-wrapper">
      <button
        className="pagination-btn"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>

      <div className="pagination-pages">
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`pagination-num-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-btn"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;

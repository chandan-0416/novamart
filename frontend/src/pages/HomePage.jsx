import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchProducts, setPage } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import Pagination from '../components/common/Pagination';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import './Pages.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, pagination, isLoading, error, filters } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, filters.page]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Banner */}
      <section className="hero-banner glass-card">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-sparkle-icon" />
            <span>Next-Gen Curated Marketplace</span>
          </div>

          <h1 className="hero-title">
            Engineered for Quality. Built for Performance.
          </h1>

          <p className="hero-description">
            Discover top-tier electronics, designer apparel, premium home essentials, and developer gear backed by instantaneous order execution and ACID reliability.
          </p>

          <div className="hero-actions">
            <a href="#catalog" className="btn btn-primary">
              <span>Browse Catalog</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="catalog-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Catalog</h2>
            <p className="section-subtitle">
              Real-time inventory powered by PostgreSQL & RESTful architecture
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <ProductFilter />

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner message="Loading catalog..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />
        ) : products.length === 0 ? (
          <div className="empty-catalog-box glass-card">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>No products found</h3>
            <p>Try adjusting your search query, price range, or category filter.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;

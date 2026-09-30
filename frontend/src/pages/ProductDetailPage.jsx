import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Plus,
  Minus
} from 'lucide-react';
import { fetchProductById, clearSelectedProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import './Pages.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, isLoading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedProduct || selectedProduct.stock_quantity <= 0) return;

    try {
      setIsAdding(true);
      await dispatch(addToCart({ productId: selectedProduct.id, quantity })).unwrap();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      // Handled in state
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading product details..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchProductById(id))} />;
  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock_quantity <= 0;

  return (
    <div className="product-detail-page animate-fade-in">
      {/* Breadcrumb / Back Link */}
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Catalog</span>
      </Link>

      <div className="product-detail-grid">
        {/* Left: Product Image */}
        <div className="detail-image-box glass-card">
          <img
            src={selectedProduct.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
            alt={selectedProduct.name}
            className="detail-main-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Right: Product Purchase Info */}
        <div className="detail-info-box glass-card">
          {selectedProduct.category_name && (
            <span className="badge badge-customer">{selectedProduct.category_name}</span>
          )}

          <h1 className="detail-title">{selectedProduct.name}</h1>

          <div className="detail-price-row">
            <span className="detail-price">${parseFloat(selectedProduct.price).toFixed(2)}</span>
            <div className={`stock-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              <Package size={14} />
              <span>{isOutOfStock ? 'Out of Stock' : `${selectedProduct.stock_quantity} Units in Stock`}</span>
            </div>
          </div>

          <div className="detail-divider" />

          <div className="detail-description-section">
            <h3>Description</h3>
            <p>{selectedProduct.description || 'No detailed description provided for this product.'}</p>
          </div>

          <div className="detail-divider" />

          {/* Quantity and Add to Cart Section */}
          <div className="detail-actions-section">
            <div className="quantity-picker-row">
              <label>Quantity:</label>
              <div className="cart-item-quantity-stepper">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="qty-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedProduct.stock_quantity, quantity + 1))}
                  disabled={quantity >= selectedProduct.stock_quantity || isOutOfStock}
                  className="qty-btn"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`btn btn-primary btn-block detail-add-btn ${isSuccess ? 'btn-success-active' : ''}`}
            >
              {isSuccess ? (
                <>
                  <Check size={20} />
                  <span>Added to Cart!</span>
                </>
              ) : isAdding ? (
                <span>Adding to Cart...</span>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} to Cart`}</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="detail-features-grid">
            <div className="feature-pill">
              <Truck size={16} />
              <span>Free Delivery on orders over $100</span>
            </div>
            <div className="feature-pill">
              <ShieldCheck size={16} />
              <span>2-Year Manufacturer Warranty</span>
            </div>
            <div className="feature-pill">
              <RotateCcw size={16} />
              <span>30-Day Hassle Free Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

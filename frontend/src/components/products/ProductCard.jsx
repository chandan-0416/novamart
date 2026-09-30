import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import './Products.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.stock_quantity <= 0) return;

    try {
      setIsAdding(true);
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (err) {
      // Handled in state
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="product-card glass-card animate-fade-in">
      <Link to={`/products/${product.id}`} className="product-card-link">
        {/* Product Image Container */}
        <div className="product-image-box">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <div className="product-image-fallback">
              <ShoppingCart size={40} className="fallback-icon" />
            </div>
          )}

          {/* Category Tag */}
          {product.category_name && (
            <span className="product-category-tag">{product.category_name}</span>
          )}

          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span>Sold Out</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>

          <p className="product-desc-snippet">
            {product.description || 'Premium craftsmanship and durable design.'}
          </p>

          <div className="product-footer">
            <div className="product-price-box">
              <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
              <span className={`stock-status ${isOutOfStock ? 'stock-out' : 'stock-in'}`}>
                {isOutOfStock ? 'Out of stock' : `${product.stock_quantity} available`}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`product-cart-btn ${isSuccess ? 'success' : ''}`}
              aria-label="Add to cart"
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              {isSuccess ? (
                <Check size={18} />
              ) : (
                <ShoppingCart size={18} />
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check, Heart, Star, Sparkles, Zap } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import './Products.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
      setTimeout(() => setIsSuccess(false), 1600);
    } catch (err) {
      // Handled in state
    } finally {
      setIsAdding(false);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const isOutOfStock = product.stock_quantity <= 0;
  const numPrice = parseFloat(product.price);
  const originalPrice = (numPrice * 1.25).toFixed(2);
  const discountPercent = Math.round(100 - (numPrice / (numPrice * 1.25)) * 100);

  // Deterministic rating based on product id
  const ratingScore = (4.7 + ((product.id % 4) * 0.08)).toFixed(1);
  const reviewCount = 24 + ((product.id * 17) % 180);

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

          {/* Floating Badges */}
          <div className="product-badge-group">
            {discountPercent > 0 && !isOutOfStock && (
              <span className="badge-deal">-{discountPercent}%</span>
            )}
            {product.stock_quantity > 0 && product.stock_quantity < 20 && (
              <span className="badge-trending"><Zap size={11} /> LIMITED</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            aria-label="Save to wishlist"
            title="Save to wishlist"
          >
            <Heart size={16} fill={isWishlisted ? '#f43f5e' : 'none'} color={isWishlisted ? '#f43f5e' : '#ffffff'} />
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span className="sold-out-badge">Sold Out</span>
            </div>
          )}
        </div>

        {/* Product Info Content */}
        <div className="product-info">
          {/* Category & Rating Row */}
          <div className="product-meta-row">
            {product.category_name && (
              <span className="product-category-tag">{product.category_name}</span>
            )}
            <div className="product-rating-box">
              <Star size={13} className="star-icon" />
              <span className="rating-num">{ratingScore}</span>
              <span className="rating-count">({reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>

          <p className="product-desc-snippet">
            {product.description || 'Premium craftsmanship and durable design engineered for everyday performance.'}
          </p>

          {/* Price & Action Row */}
          <div className="product-footer">
            <div className="product-price-box">
              <div className="price-row">
                <span className="product-price">${numPrice.toFixed(2)}</span>
                {!isOutOfStock && (
                  <span className="product-original-price">${originalPrice}</span>
                )}
              </div>
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
                <Check size={18} className="btn-icon-success" />
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

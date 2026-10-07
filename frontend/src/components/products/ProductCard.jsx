import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check, Heart, Star, Zap } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';

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
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col">
      <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
        {/* Product Image Container */}
        <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <ShoppingCart size={48} />
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {discountPercent > 0 && !isOutOfStock && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500 text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.stock_quantity > 0 && product.stock_quantity < 20 && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                <Zap size={10} /> LOW STOCK
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-slate-600 hover:text-red-500 flex items-center justify-center shadow-sm transition-colors z-10"
            aria-label="Save to wishlist"
          >
            <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider truncate">
              {product.category_name || 'General'}
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700">{ratingScore}</span>
              <span className="text-slate-400">({reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors mb-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description || 'Premium craftsmanship and durable design engineered for everyday performance.'}
          </p>

          {/* Price & Action Row */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-slate-900">
                  ${numPrice.toFixed(2)}
                </span>
                {!isOutOfStock && (
                  <span className="text-xs text-slate-400 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium block ${isOutOfStock ? 'text-red-500' : 'text-slate-500'}`}>
                {isOutOfStock ? 'Out of stock' : `${product.stock_quantity} available`}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : isOutOfStock
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-sm'
              }`}
              aria-label="Add to cart"
            >
              {isSuccess ? <Check size={18} /> : <ShoppingCart size={18} />}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

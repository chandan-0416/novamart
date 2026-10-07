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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        {/* Left: Product Image */}
        <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
          <img
            src={selectedProduct.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
            alt={selectedProduct.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Right: Product Purchase Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {selectedProduct.category_name && (
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                {selectedProduct.category_name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{parseFloat(selectedProduct.price).toFixed(2)}
              </span>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isOutOfStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <Package size={14} />
                <span>{isOutOfStock ? 'Out of Stock' : `${selectedProduct.stock_quantity} Units in Stock`}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedProduct.description || 'No detailed description provided for this product.'}
              </p>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700 uppercase">Quantity:</label>
              <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedProduct.stock_quantity, quantity + 1))}
                  disabled={quantity >= selectedProduct.stock_quantity || isOutOfStock}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check size={18} />
                  <span>Added to Cart!</span>
                </>
              ) : isAdding ? (
                <span>Adding to Cart...</span>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} to Cart`}</span>
                </>
              )}
            </button>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium">
                <Truck size={16} className="text-violet-600 flex-shrink-0" />
                <span>Free Shipping &gt;₹500</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium">
                <RotateCcw size={16} className="text-pink-600 flex-shrink-0" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

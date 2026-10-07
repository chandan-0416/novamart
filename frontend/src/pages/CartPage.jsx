import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { fetchCart, clearCart } from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount, isLoading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to empty your shopping cart?')) {
      dispatch(clearCart());
    }
  };

  if (isLoading && items.length === 0) {
    return <LoadingSpinner message="Loading your shopping cart..." />;
  }

  if (error && items.length === 0) {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchCart())} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalItems === 0
              ? 'Your cart is currently empty'
              : `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Trash2 size={15} />
            <span>Empty Cart</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Explore our wide collection of curated electronics, apparel, and lifestyle drops.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-500/20 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <CartSummary totalAmount={totalAmount} totalItems={totalItems} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

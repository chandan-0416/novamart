import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { fetchCart, clearCart } from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import './Pages.css';

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
    <div className="cart-page animate-fade-in">
      <div className="page-header">
        <div className="cart-header-row">
          <div>
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">
              {totalItems === 0
                ? 'Your cart is currently empty'
                : `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
            </p>
          </div>

          {items.length > 0 && (
            <button onClick={handleClearCart} className="btn btn-secondary btn-sm clear-cart-btn">
              <Trash2 size={16} />
              <span>Empty Cart</span>
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart-view glass-card">
          <div className="empty-cart-icon-box">
            <ShoppingBag size={36} />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Explore our wide collection of premium electronics, fashion, and gear.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-container">
            {items.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>

          {/* Pricing Summary */}
          <CartSummary totalAmount={totalAmount} totalItems={totalItems} />
        </div>
      )}
    </div>
  );
};

export default CartPage;

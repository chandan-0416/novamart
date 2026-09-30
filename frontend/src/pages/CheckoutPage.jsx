import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ShieldCheck, MapPin, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { createOrder, resetOrderSuccess } from '../store/slices/orderSlice';
import { fetchCart } from '../store/slices/cartSlice';
import CartSummary from '../components/cart/CartSummary';
import './Pages.css';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, orderSuccess, currentOrder, error } = useSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] = useState({
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
  });

  useEffect(() => {
    dispatch(fetchCart());
    return () => {
      dispatch(resetOrderSuccess());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const fullAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`;
    dispatch(createOrder({ shippingAddress: fullAddress }));
  };

  if (orderSuccess && currentOrder) {
    return (
      <div className="checkout-success-view glass-card animate-fade-in">
        <div className="success-icon-box">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">
          Thank you, <strong>{user?.name}</strong>. Your order has been placed successfully and processed atomically in PostgreSQL.
        </p>

        <div className="order-receipt-card">
          <div className="receipt-row">
            <span>Order ID</span>
            <strong>#{currentOrder.id}</strong>
          </div>
          <div className="receipt-row">
            <span>Total Paid</span>
            <strong>${parseFloat(currentOrder.total_amount).toFixed(2)}</strong>
          </div>
          <div className="receipt-row">
            <span>Shipping To</span>
            <span>{currentOrder.shipping_address}</span>
          </div>
          <div className="receipt-row">
            <span>Payment Status</span>
            <span className="badge badge-status-delivered">{currentOrder.payment_status}</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">
            <span>View My Orders</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/" className="btn btn-secondary">
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="empty-cart-view glass-card animate-fade-in">
        <h2>Your Cart is Empty</h2>
        <p>You cannot proceed to checkout with an empty cart.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Review shipping address and place your order</p>
      </div>

      {error && <div className="auth-error-banner" style={{ marginBottom: 24 }}>{error}</div>}

      <div className="checkout-layout">
        {/* Left: Shipping Details Form */}
        <div className="checkout-form-container glass-card">
          <div className="checkout-section-header">
            <MapPin size={20} className="header-icon" />
            <h3>Shipping Address</h3>
          </div>

          <form id="checkout-form" onSubmit={handleSubmitOrder} className="checkout-form">
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                required
                value={shippingAddress.street}
                onChange={handleInputChange}
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                />
              </div>

              <div className="form-group">
                <label>State / Province *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Postal Code / ZIP *</label>
              <input
                type="text"
                name="zip"
                required
                value={shippingAddress.zip}
                onChange={handleInputChange}
                placeholder="10001"
              />
            </div>

            <div className="payment-method-box">
              <div className="payment-header">
                <ShieldCheck size={20} className="secure-icon" />
                <div>
                  <h4>Instant Demo Payment</h4>
                  <p>Transaction processed securely with raw SQL row locking.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="btn btn-primary btn-block place-order-btn"
            >
              {isLoading ? 'Processing Order...' : `Pay & Place Order ($${(totalAmount + (totalAmount > 100 ? 0 : 9.99)).toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Right: Order Review */}
        <div className="checkout-summary-container">
          <div className="checkout-items-preview glass-card">
            <h3>Items in Order ({totalItems})</h3>
            <div className="preview-items-list">
              {items.map((item) => (
                <div key={item.product_id} className="preview-item-row">
                  <div className="preview-item-info">
                    <span className="preview-qty">{item.quantity}x</span>
                    <span className="preview-name">{item.name}</span>
                  </div>
                  <span className="preview-subtotal">${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <CartSummary
            totalAmount={totalAmount}
            totalItems={totalItems}
            showCheckoutButton={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

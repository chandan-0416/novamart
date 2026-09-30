import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import './Cart.css';

const CartSummary = ({ totalAmount, totalItems, showCheckoutButton = true }) => {
  const shippingCost = totalAmount > 100 || totalAmount === 0 ? 0 : 9.99;
  const grandTotal = totalAmount + shippingCost;

  return (
    <div className="cart-summary glass-card">
      <h3 className="summary-title">Order Summary</h3>

      <div className="summary-rows">
        <div className="summary-row">
          <span>Items Subtotal ({totalItems})</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Shipping & Handling</span>
          <span>
            {shippingCost === 0 ? (
              <span className="free-shipping-tag">FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="summary-row">
          <span>Estimated Sales Tax</span>
          <span>$0.00</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-row grand-total-row">
          <span>Total</span>
          <span className="grand-total-amount">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="btn btn-primary btn-block checkout-action-btn"
          disabled={totalItems === 0}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </Link>
      )}

      <div className="summary-guarantee">
        <ShieldCheck size={18} className="guarantee-icon" />
        <span>30-Day Guaranteed Returns & Fast Dispatch</span>
      </div>
    </div>
  );
};

export default CartSummary;

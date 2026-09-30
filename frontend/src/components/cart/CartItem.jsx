import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, Plus, Minus } from 'lucide-react';
import { updateCartItem, removeCartItem } from '../../store/slices/cartSlice';
import './Cart.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityIncrease = () => {
    if (item.quantity < item.stock_quantity) {
      dispatch(updateCartItem({ productId: item.product_id, quantity: item.quantity + 1 }));
    }
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      dispatch(updateCartItem({ productId: item.product_id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeCartItem(item.product_id));
    }
  };

  const handleRemove = () => {
    dispatch(removeCartItem(item.product_id));
  };

  return (
    <div className="cart-item glass-card animate-fade-in">
      {/* Product Image */}
      <div className="cart-item-image-box">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
          alt={item.name}
          className="cart-item-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Info */}
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.name}</h4>
        <p className="cart-item-unit-price">${parseFloat(item.price).toFixed(2)} each</p>
        {item.stock_quantity < item.quantity && (
          <span className="cart-stock-warning">Exceeds available stock ({item.stock_quantity})</span>
        )}
      </div>

      {/* Quantity Stepper */}
      <div className="cart-item-quantity-stepper">
        <button
          onClick={handleQuantityDecrease}
          className="qty-btn"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          onClick={handleQuantityIncrease}
          disabled={item.quantity >= item.stock_quantity}
          className="qty-btn"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Line Subtotal */}
      <div className="cart-item-subtotal">
        <span className="subtotal-amount">${parseFloat(item.subtotal).toFixed(2)}</span>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="cart-item-remove-btn"
        aria-label="Remove item"
        title="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;

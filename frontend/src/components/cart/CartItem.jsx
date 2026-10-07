import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, Plus, Minus } from 'lucide-react';
import { updateCartItem, removeCartItem } from '../../store/slices/cartSlice';

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Image & Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
          <p className="text-xs text-slate-500">${parseFloat(item.price).toFixed(2)} each</p>
          {item.stock_quantity < item.quantity && (
            <span className="text-[11px] text-red-500 font-semibold">Exceeds available stock ({item.stock_quantity})</span>
          )}
        </div>
      </div>

      {/* Stepper + Subtotal + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            onClick={handleQuantityDecrease}
            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100"
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
          <button
            onClick={handleQuantityIncrease}
            disabled={item.quantity >= item.stock_quantity}
            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="text-right min-w-[70px]">
          <span className="text-sm font-extrabold text-slate-900">${parseFloat(item.subtotal).toFixed(2)}</span>
        </div>

        <button
          onClick={handleRemove}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

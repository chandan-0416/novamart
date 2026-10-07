import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const CartSummary = ({ totalAmount, totalItems, showCheckoutButton = true }) => {
  const shippingCost = totalAmount > 500 || totalAmount === 0 ? 0 : 49.00;
  const grandTotal = totalAmount + shippingCost;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit">
      <h3 className="font-extrabold text-slate-900 text-base">Order Summary</h3>

      <div className="space-y-3 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Items Subtotal ({totalItems})</span>
          <span className="font-semibold text-slate-900">₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Shipping & Handling</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">FREE</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Estimated Sales Tax</span>
          <span className="font-semibold text-slate-900">₹0.00</span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-sm">
          <span className="font-bold text-slate-900">Total</span>
          <span className="text-xl font-extrabold text-slate-900">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className={`w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 ${
            totalItems === 0 ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={16} />
        </Link>
      )}

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck size={16} className="text-emerald-600" />
        <span>30-Day Guaranteed Returns & Fast Dispatch</span>
      </div>
    </div>
  );
};

export default CartSummary;

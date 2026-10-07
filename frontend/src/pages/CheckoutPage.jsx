import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ShieldCheck, MapPin, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { createOrder, resetOrderSuccess } from '../store/slices/orderSlice';
import { fetchCart } from '../store/slices/cartSlice';
import CartSummary from '../components/cart/CartSummary';

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
      <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Order Confirmed!</h1>
          <p className="text-xs text-slate-500 mt-1">
            Thank you, <strong>{user?.name}</strong>. Your order has been placed successfully.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2.5 text-slate-700 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-mono font-bold">#{currentOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Paid:</span>
            <span className="font-bold text-slate-900">${parseFloat(currentOrder.total_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Shipping To:</span>
            <span className="font-medium text-right max-w-[200px] truncate">{currentOrder.shipping_address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
              {currentOrder.payment_status}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/orders"
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Orders</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">You cannot proceed to checkout with an empty cart.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Review shipping details and place your order</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-4">
            <MapPin size={20} className="text-violet-600" />
            <h3 className="font-bold text-base">Shipping Address</h3>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Street Address *</label>
              <input
                type="text"
                name="street"
                required
                value={shippingAddress.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">State / Province *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                  placeholder="NY"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Postal Code / ZIP *</label>
              <input
                type="text"
                name="zip"
                required
                value={shippingAddress.zip}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                placeholder="10001"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-slate-900">Secure Direct Settlement</h4>
                <p className="text-[11px] text-slate-500">Atomic inventory locking enabled on checkout.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading
                ? 'Processing Order...'
                : `Pay & Place Order ($${(totalAmount + (totalAmount > 100 ? 0 : 9.99)).toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Review Side */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Items in Order ({totalItems})</h3>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product_id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">{item.quantity}x</span>
                    <span className="text-slate-800 font-medium truncate max-w-[160px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <CartSummary totalAmount={totalAmount} totalItems={totalItems} showCheckoutButton={false} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

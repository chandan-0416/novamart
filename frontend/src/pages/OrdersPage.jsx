import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { fetchOrders, fetchOrderById } from '../store/slices/orderSlice';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading, error } = useSelector((state) => state.orders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const toggleExpandOrder = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);
    if (!orderDetailsMap[orderId]) {
      const result = await dispatch(fetchOrderById(orderId)).unwrap();
      setOrderDetailsMap((prev) => ({ ...prev, [orderId]: result }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
    }
  };

  if (isLoading && orders.length === 0) {
    return <LoadingSpinner message="Loading your order history..." />;
  }

  if (error && orders.length === 0) {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchOrders({ page: 1 }))} />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
        <p className="text-xs text-slate-500 mt-1">Track, view and manage your recent purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Orders Found</h2>
          <p className="text-xs text-slate-500">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const details = orderDetailsMap[order.id];

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  onClick={() => toggleExpandOrder(order.id)}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Order Ref</span>
                      <strong className="text-xs font-mono font-bold text-slate-900">#{order.id}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date</span>
                      <span className="text-xs text-slate-700 font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
                      <strong className="text-xs font-bold text-violet-600">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <button className="p-2 text-slate-400 hover:text-slate-600 self-end sm:self-center" aria-label="Toggle details">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4 text-xs">
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-800">Shipping Address: </strong>
                        <span>{order.shipping_address}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pt-2">Purchased Items</h4>

                    {!details ? (
                      <LoadingSpinner message="Fetching items..." />
                    ) : (
                      <div className="divide-y divide-slate-200 bg-white rounded-xl border border-slate-200 overflow-hidden">
                        {details.items?.map((item) => (
                          <div key={item.id || item.product_id} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-500">{item.quantity}x</span>
                              <span className="text-slate-800 font-medium">{item.product_name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-400 text-[11px]">₹{parseFloat(item.unit_price).toFixed(2)} ea</span>
                              <strong className="text-slate-900">₹{parseFloat(item.subtotal).toFixed(2)}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <Pagination
            pagination={pagination}
            onPageChange={(p) => dispatch(fetchOrders({ page: p }))}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

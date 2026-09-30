import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Calendar, MapPin, DollarSign, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { fetchOrders, fetchOrderById } from '../store/slices/orderSlice';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import './Pages.css';

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing': return 'badge-status-processing';
      case 'shipped': return 'badge-status-shipped';
      case 'delivered': return 'badge-status-delivered';
      case 'cancelled': return 'badge-status-cancelled';
      default: return 'badge-status-pending';
    }
  };

  if (isLoading && orders.length === 0) {
    return <LoadingSpinner message="Loading your order history..." />;
  }

  if (error && orders.length === 0) {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchOrders({ page: 1 }))} />;
  }

  return (
    <div className="orders-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Order History</h1>
        <p className="page-subtitle">Track, view and manage your recent purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart-view glass-card">
          <div className="empty-cart-icon-box">
            <ShoppingBag size={36} />
          </div>
          <h2>No Orders Found</h2>
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const details = orderDetailsMap[order.id];

            return (
              <div key={order.id} className="order-card glass-card">
                <div className="order-card-header" onClick={() => toggleExpandOrder(order.id)}>
                  <div className="order-meta-grid">
                    <div className="meta-col">
                      <span className="meta-label">Order Reference</span>
                      <strong className="meta-value">#{order.id}</strong>
                    </div>

                    <div className="meta-col">
                      <span className="meta-label">Date Placed</span>
                      <span className="meta-value">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="meta-col">
                      <span className="meta-label">Total Amount</span>
                      <strong className="meta-value text-accent">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </strong>
                    </div>

                    <div className="meta-col">
                      <span className="meta-label">Status</span>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <button className="expand-order-btn" aria-label="Toggle details">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="order-card-body animate-fade-in">
                    <div className="order-address-box">
                      <MapPin size={16} className="address-icon" />
                      <div>
                        <strong>Shipping Address: </strong>
                        <span>{order.shipping_address}</span>
                      </div>
                    </div>

                    <h4 className="order-items-heading">Purchased Items</h4>

                    {!details ? (
                      <LoadingSpinner message="Fetching item details..." />
                    ) : (
                      <div className="order-items-table">
                        {details.items?.map((item) => (
                          <div key={item.id || item.product_id} className="order-item-row">
                            <div className="order-item-title-box">
                              <span className="item-qty">{item.quantity}x</span>
                              <span className="item-name">{item.product_name}</span>
                            </div>
                            <span className="item-unit-price">
                              ${parseFloat(item.unit_price).toFixed(2)} / unit
                            </span>
                            <strong className="item-subtotal">
                              ${parseFloat(item.subtotal).toFixed(2)}
                            </strong>
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

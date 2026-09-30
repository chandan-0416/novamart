import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
  Boxes,
  Users
} from 'lucide-react';
import { fetchProducts, deleteProduct } from '../store/slices/productSlice';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import ProductModal from '../components/admin/ProductModal';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import './Pages.css';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { products, pagination: prodPagination, isLoading: prodLoading } = useSelector(
    (state) => state.products
  );
  const { orders, pagination: orderPagination, isLoading: orderLoading } = useSelector(
    (state) => state.orders
  );

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete or deactivate "${productName}"?`)) {
      dispatch(deleteProduct(productId));
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  // Metrics computation
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const totalProductsCount = prodPagination?.totalItems || products.length;
  const totalOrdersCount = orderPagination?.totalItems || orders.length;

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Management Console</h1>
        <p className="page-subtitle">
          Real-time PostgreSQL inventory, catalog administration and order fulfillment
        </p>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-icon-box sales">
            <DollarSign size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Revenue</span>
            <span className="metric-value">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon-box orders">
            <Package size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Orders</span>
            <span className="metric-value">{totalOrdersCount}</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon-box products">
            <Boxes size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Products In Catalog</span>
            <span className="metric-value">{totalProductsCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginTop: 24 }}>
        <button
          onClick={() => setActiveTab('products')}
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Boxes size={18} />
          <span>Product Catalog ({totalProductsCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Customer Orders ({totalOrdersCount})</span>
        </button>
      </div>

      {/* Tab 1: Products Management */}
      {activeTab === 'products' && (
        <div className="admin-tab-content animate-fade-in" style={{ marginTop: 20 }}>
          <div className="admin-section-header">
            <h2 className="admin-section-title">Catalog Inventory</h2>
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          </div>

          {prodLoading && products.length === 0 ? (
            <LoadingSpinner message="Loading products..." />
          ) : (
            <>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="table-product-cell">
                            <img
                              src={p.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="table-product-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
                              }}
                            />
                            <strong>{p.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-customer">{p.category_name || 'General'}</span>
                        </td>
                        <td>${parseFloat(p.price).toFixed(2)}</td>
                        <td>
                          <span className={p.stock_quantity > 0 ? 'stock-in' : 'stock-out'}>
                            {p.stock_quantity} units
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${p.is_active ? 'badge-status-delivered' : 'badge-status-cancelled'}`}>
                            {p.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="action-icon-btn edit"
                              title="Edit product"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="action-icon-btn delete"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                pagination={prodPagination}
                onPageChange={(page) => dispatch(fetchProducts())}
              />
            </>
          )}
        </div>
      )}

      {/* Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="admin-tab-content animate-fade-in" style={{ marginTop: 20 }}>
          <div className="admin-section-header">
            <h2 className="admin-section-title">Customer Orders & Fulfillment</h2>
          </div>

          {orderLoading && orders.length === 0 ? (
            <LoadingSpinner message="Loading orders..." />
          ) : orders.length === 0 ? (
            <div className="empty-catalog-box glass-card">
              <h3>No Customer Orders</h3>
              <p>Orders placed by users will appear here for processing.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Shipping Address</th>
                    <th>Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>#{o.id}</strong></td>
                      <td>
                        <div>
                          <div>{o.user_name}</div>
                          <small style={{ color: 'var(--text-muted)' }}>{o.user_email}</small>
                        </div>
                      </td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td><strong>${parseFloat(o.total_amount).toFixed(2)}</strong></td>
                      <td style={{ maxWidth: 220, fontSize: '0.82rem' }}>{o.shipping_address}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="status-dropdown-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default AdminDashboardPage;

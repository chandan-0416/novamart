import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Boxes
} from 'lucide-react';
import { fetchProducts, deleteProduct } from '../store/slices/productSlice';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import ProductModal from '../components/admin/ProductModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

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
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
        <p className="text-xs text-slate-500 mt-1">
          PostgreSQL inventory management, catalog administration and order fulfillment
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Revenue</span>
            <span className="text-2xl font-extrabold text-slate-900">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Orders</span>
            <span className="text-2xl font-extrabold text-slate-900">{totalOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Boxes size={24} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Catalog Products</span>
            <span className="text-2xl font-extrabold text-slate-900">{totalProductsCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes size={16} />
          <span>Product Catalog ({totalProductsCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package size={16} />
          <span>Orders ({totalOrdersCount})</span>
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Inventory Catalog</h2>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>

          {prodLoading && products.length === 0 ? (
            <LoadingSpinner message="Loading products..." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
                              }}
                            />
                            <strong className="text-slate-900 font-semibold">{p.name}</strong>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{p.category_name || 'General'}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">${parseFloat(p.price).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={p.stock_quantity > 0 ? 'text-emerald-700 font-semibold' : 'text-red-500 font-semibold'}>
                            {p.stock_quantity} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {p.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                              title="Edit product"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-slate-100">
                <Pagination
                  pagination={prodPagination}
                  onPageChange={(page) => dispatch(fetchProducts())}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Customer Orders</h2>

          {orderLoading && orders.length === 0 ? (
            <LoadingSpinner message="Loading orders..." />
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No customer orders recorded yet.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Shipping Address</th>
                      <th className="py-3 px-4">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">#{o.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{o.user_name}</div>
                          <div className="text-[10px] text-slate-400">{o.user_email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">${parseFloat(o.total_amount).toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{o.shipping_address}</td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
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
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default AdminDashboardPage;

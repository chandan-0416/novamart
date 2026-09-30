import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Shield, Calendar, PackageCheck, ShoppingBag, LogOut } from 'lucide-react';
import { fetchUserProfile, logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import './Pages.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pagination } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchOrders({ page: 1, limit: 1 }));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Account</h1>
        <p className="page-subtitle">Manage your profile information and view account metrics</p>
      </div>

      <div className="profile-grid">
        {/* User Card */}
        <div className="profile-card glass-card">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <h2 className="profile-user-name">{user?.name}</h2>
          <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-customer'}`}>
            {user?.role}
          </span>

          <div className="profile-details-list">
            <div className="profile-detail-item">
              <Mail size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Email Address</span>
                <span className="detail-val">{user?.email}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <Shield size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Account Role</span>
                <span className="detail-val" style={{ textTransform: 'capitalize' }}>
                  {user?.role} Access
                </span>
              </div>
            </div>

            <div className="profile-detail-item">
              <Calendar size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Member Since</span>
                <span className="detail-val">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recently joined'}
                </span>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary btn-block logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Overview & Quick Links */}
        <div className="profile-stats-column">
          <div className="profile-stat-box glass-card">
            <div className="stat-header">
              <PackageCheck size={24} className="stat-icon" />
              <div>
                <h3>Orders Placed</h3>
                <p>Total lifetime purchases made</p>
              </div>
            </div>
            <div className="stat-number">{pagination?.totalItems || 0}</div>
            <Link to="/orders" className="btn btn-primary btn-sm">
              <span>View Order History</span>
            </Link>
          </div>

          <div className="profile-stat-box glass-card">
            <div className="stat-header">
              <ShoppingBag size={24} className="stat-icon" style={{ color: 'var(--secondary)' }} />
              <div>
                <h3>Product Catalog</h3>
                <p>Browse newly added products</p>
              </div>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
              <span>Shop Now</span>
            </Link>
          </div>

          {user?.role === 'admin' && (
            <div className="profile-stat-box glass-card admin-highlight-box">
              <div className="stat-header">
                <Shield size={24} className="stat-icon" style={{ color: 'var(--secondary)' }} />
                <div>
                  <h3>Admin Control Panel</h3>
                  <p>Manage catalog, stock levels and all customer orders</p>
                </div>
              </div>
              <Link to="/admin" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                <span>Open Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

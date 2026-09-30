import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Shield,
  Search,
  Menu,
  X,
  PackageCheck,
  ChevronDown
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { setFilter, fetchProducts } from '../../store/slices/productSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ search: searchQuery }));
    dispatch(fetchProducts());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box">
            <ShoppingBag className="brand-icon" size={22} />
          </div>
          <span className="brand-text">
            Nova<span className="brand-accent">Mart</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search premium electronics, fashion, gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setSearchQuery('');
                dispatch(setFilter({ search: '' }));
                dispatch(fetchProducts());
              }}
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Desktop Navigation Links */}
        <nav className="navbar-actions">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Catalog
          </Link>

          {isAuthenticated && (
            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
              <PackageCheck size={18} />
              <span>Orders</span>
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link admin-nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              <Shield size={18} />
              <span>Admin</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* User Profile / Auth Actions */}
          {isAuthenticated ? (
            <div className="user-dropdown-wrapper">
              <button
                className="user-profile-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details-compact">
                  <span className="user-name">{user?.name}</span>
                  {user?.role === 'admin' && <span className="role-pill">Admin</span>}
                </div>
                <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown-menu animate-fade-in" onClick={() => setIsDropdownOpen(false)}>
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    <PackageCheck size={16} />
                    <span>My Orders</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item dropdown-admin-item">
                      <Shield size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item dropdown-logout-item">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="mobile-drawer animate-fade-in" onClick={() => setIsMenuOpen(false)}>
          <Link to="/" className="mobile-link">Catalog</Link>
          <Link to="/cart" className="mobile-link">Cart ({totalItems})</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="mobile-link">My Profile</Link>
              <Link to="/orders" className="mobile-link">My Orders</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="mobile-link admin-mobile-link">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="mobile-link mobile-logout-btn">
                Sign Out ({user?.name})
              </button>
            </>
          ) : (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn btn-secondary btn-block">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-block">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

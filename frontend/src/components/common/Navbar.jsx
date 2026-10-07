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
  ChevronDown,
  Sparkles,
  Zap,
  Flame,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { setFilter, fetchProducts } from '../../store/slices/productSlice';
import './Navbar.css';

const CATEGORY_TABS = [
  { name: 'All Drops', value: '', icon: Flame },
  { name: 'Electronics', value: 'Electronics', icon: Zap },
  { name: 'Clothing', value: 'Clothing', icon: Sparkles },
  { name: 'Home & Kitchen', value: 'Home & Kitchen', icon: Layers },
  { name: 'Books', value: 'Books', icon: Sparkles },
  { name: 'Sports & Outdoors', value: 'Sports & Outdoors', icon: Zap }
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { filters } = useSelector((state) => state.products);
  
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

  const handleCategoryTabClick = (categoryValue) => {
    dispatch(setFilter({ category: categoryValue }));
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
      {/* Top Announcement Marquee Strip */}
      <div className="announcement-bar">
        <div className="announcement-track">
          <div className="announcement-content">
            <span className="announcement-item"><Flame size={13} className="ann-icon text-pink" /> <strong>SUMMER '26 EDIT:</strong> USE CODE <strong className="code-pill">TREND20</strong> FOR 20% OFF ALL DROPS</span>
            <span className="announcement-separator">•</span>
            <span className="announcement-item"><Zap size={13} className="ann-icon text-cyan" /> <strong>GLOBAL EXPRESS:</strong> FREE 2-DAY COURIER ON ALL ORDERS OVER $100</span>
            <span className="announcement-separator">•</span>
            <span className="announcement-item"><Sparkles size={13} className="ann-icon text-gold" /> <strong>VERIFIED AUTHENTIC:</strong> 100% ORIGINAL DESIGN & 30-DAY EFFORTLESS RETURNS</span>
            <span className="announcement-separator">•</span>
            <span className="announcement-item"><Flame size={13} className="ann-icon text-pink" /> <strong>SUMMER '26 EDIT:</strong> USE CODE <strong className="code-pill">TREND20</strong> FOR 20% OFF ALL DROPS</span>
            <span className="announcement-separator">•</span>
            <span className="announcement-item"><Zap size={13} className="ann-icon text-cyan" /> <strong>GLOBAL EXPRESS:</strong> FREE 2-DAY COURIER ON ALL ORDERS OVER $100</span>
            <span className="announcement-separator">•</span>
            <span className="announcement-item"><Sparkles size={13} className="ann-icon text-gold" /> <strong>VERIFIED AUTHENTIC:</strong> 100% ORIGINAL DESIGN & 30-DAY EFFORTLESS RETURNS</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box">
            <ShoppingBag className="brand-icon" size={20} />
          </div>
          <span className="brand-text">
            Nova<span className="brand-accent">Mart</span>
          </span>
          <span className="brand-market-badge">MARKET</span>
        </Link>

        {/* Global Search Bar */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <Search className="search-icon" size={17} />
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

        {/* Desktop Navigation Actions */}
        <nav className="navbar-actions">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Catalog
          </Link>

          {isAuthenticated && (
            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
              <PackageCheck size={17} />
              <span>Orders</span>
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link admin-nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              <Shield size={17} />
              <span>Admin</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
            <div className="cart-icon-wrap">
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
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
                <ChevronDown size={14} className={`dropdown-chevron ${isDropdownOpen ? 'rotate' : ''}`} />
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
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sub-Navbar Trending Category Strip */}
      <div className="category-rail-wrapper">
        <div className="category-rail">
          {CATEGORY_TABS.map((tab) => {
            const isActive = (!filters?.category && tab.value === '') || filters?.category === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => handleCategoryTabClick(tab.value)}
                className={`rail-tab ${isActive ? 'active' : ''}`}
              >
                <Icon size={13} className="rail-icon" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="mobile-drawer animate-fade-in" onClick={() => setIsMenuOpen(false)}>
          <div className="mobile-drawer-header">
            <span className="brand-text">Nova<span className="brand-accent">Mart</span></span>
            <span className="badge badge-customer">Trending Market</span>
          </div>

          <Link to="/" className="mobile-link">Catalog & Drops</Link>
          <Link to="/cart" className="mobile-link">Shopping Cart ({totalItems})</Link>
          
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

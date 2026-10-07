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
  Layers
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { setFilter, fetchProducts } from '../../store/slices/productSlice';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              NEW RELEASE
            </span>
            <span className="hidden sm:inline">Use code <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">NOVA20</strong> for 20% off all orders</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Free 2-Day Courier on Orders $100+</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline hover:text-slate-200 transition-colors">100% Authentic Guarantee</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:bg-violet-700 transition-colors">
              <ShoppingBag size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Nova<span className="text-violet-600">Mart</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400 -mt-1">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative items-center">
            <Search className="absolute left-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search drops, tech, clothing, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  dispatch(setFilter({ search: '' }));
                  dispatch(fetchProducts());
                }}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </form>

          {/* Desktop Navigation Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`hidden sm:inline-flex text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' ? 'text-violet-600 bg-violet-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Catalog
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/orders' ? 'text-violet-600 bg-violet-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PackageCheck size={16} />
                <span>Orders</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 transition-colors`}
              >
                <Shield size={14} />
                <span>Admin</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-violet-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User size={16} className="text-slate-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <PackageCheck size={16} className="text-slate-400" />
                        <span>My Orders</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 font-semibold"
                        >
                          <Shield size={16} className="text-pink-500" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-sm shadow-violet-500/20 transition-all hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Field */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3 relative">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
          />
        </form>
      </div>

      {/* Category Pills Rail */}
      <div className="bg-slate-50 border-t border-slate-200 overflow-x-auto scrollbar-none py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = (!filters?.category && tab.value === '') || filters?.category === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => handleCategoryTabClick(tab.value)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                <Icon size={12} className={isActive ? 'text-violet-400' : 'text-slate-400'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3" onClick={() => setIsMenuOpen(false)}>
          <Link to="/" className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">
            Catalog & All Drops
          </Link>
          <Link to="/cart" className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">
            Shopping Cart ({totalItems})
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">
                My Profile
              </Link>
              <Link to="/orders" className="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">
                My Orders
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block text-sm font-bold text-pink-600 py-2 border-b border-slate-100">
                  Admin Console
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-semibold text-red-600 py-2"
              >
                Sign Out ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg">
                Sign In
              </Link>
              <Link to="/register" className="w-full text-center py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

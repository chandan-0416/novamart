import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, Key, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import './Pages.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const fillDemoCustomer = () => {
    setFormData({
      email: 'customer@example.com',
      password: 'Customer@123456',
    });
  };

  const fillDemoAdmin = () => {
    setFormData({
      email: 'admin@example.com',
      password: 'Admin@123456',
    });
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-card-header">
          <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
            <LogIn size={20} />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage orders, checkout, or configure products</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Credentials Quick Fill Buttons */}
        <div className="demo-credentials-box">
          <div className="demo-header">
            <Sparkles size={14} />
            <span>Quick Demo Credentials</span>
          </div>
          <div className="demo-buttons-row">
            <button type="button" onClick={fillDemoCustomer} className="demo-fill-btn customer">
              <UserCheck size={14} />
              <span>Customer Demo</span>
            </button>
            <button type="button" onClick={fillDemoAdmin} className="demo-fill-btn admin">
              <Key size={14} />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Key className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-block auth-submit-btn"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

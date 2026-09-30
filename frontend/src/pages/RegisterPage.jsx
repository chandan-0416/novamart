import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, User, Mail, Key, Shield, ShieldAlert } from 'lucide-react';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import './Pages.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [clientError, setClientError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (formData.password.length < 6) {
      setClientError('Password must be at least 6 characters');
      return;
    }

    dispatch(registerUser(formData));
  };

  const displayError = clientError || error;

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-card-header">
          <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
            <UserPlus size={20} />
          </div>
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join NovaMart for instant checkout and order tracking</p>
        </div>

        {displayError && (
          <div className="auth-error-banner">
            <ShieldAlert size={18} />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
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
            <label htmlFor="password">Password (min 6 chars) *</label>
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

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <div className="input-with-icon">
              <Shield className="input-icon" size={18} />
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="customer">Customer (Shop & Order)</option>
                <option value="admin">Administrator (Catalog & Orders Management)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-block auth-submit-btn"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

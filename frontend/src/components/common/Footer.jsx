import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-highlights">
        <div className="highlight-item">
          <Truck className="highlight-icon" size={24} />
          <div>
            <h4>Express Worldwide Delivery</h4>
            <p>Fast, tracked shipping on all orders</p>
          </div>
        </div>
        <div className="highlight-item">
          <ShieldCheck className="highlight-icon" size={24} />
          <div>
            <h4>Secure Transactions</h4>
            <p>256-bit SSL encrypted checkout</p>
          </div>
        </div>
        <div className="highlight-item">
          <RefreshCw className="highlight-icon" size={24} />
          <div>
            <h4>30-Day Money Back</h4>
            <p>Hassle-free returns & replacements</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand-section">
          <div className="footer-brand">
            <div className="brand-icon-box small">
              <ShoppingBag size={18} />
            </div>
            <span className="brand-text">Nova<span className="brand-accent">Mart</span></span>
          </div>
          <p className="footer-tagline">
            Next-generation e-commerce platform engineered with React, Redux Toolkit, and Node.js + Raw SQL.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h5>Categories</h5>
            <ul>
              <li>Electronics</li>
              <li>Clothing & Fashion</li>
              <li>Home & Kitchen</li>
              <li>Books & Audio</li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <ul>
              <li>REST API Reference</li>
              <li>PostgreSQL Raw SQL Engine</li>
              <li>JWT Authentication</li>
              <li>ACID Order Processing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NovaMart Inc. Built for high performance and scalability.</p>
        <p className="footer-tech-stack">
          Node.js • Express • PostgreSQL • React • Redux Toolkit
        </p>
      </div>
    </footer>
  );
};

export default Footer;

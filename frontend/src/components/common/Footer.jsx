import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CreditCard,
  Lock,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Github
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      {/* Footer Top Highlights */}
      <div className="footer-highlights">
        <div className="highlight-item">
          <Truck className="highlight-icon text-cyan" size={24} />
          <div>
            <h4>Express Global Courier</h4>
            <p>Fast, tracked shipping with 24h dispatch</p>
          </div>
        </div>
        <div className="highlight-item">
          <ShieldCheck className="highlight-icon text-emerald" size={24} />
          <div>
            <h4>100% Verified Originals</h4>
            <p>Authenticity guaranteed on every piece</p>
          </div>
        </div>
        <div className="highlight-item">
          <RotateCcw className="highlight-icon text-pink" size={24} />
          <div>
            <h4>30-Day Frictionless Returns</h4>
            <p>Prepaid return label & instant refund</p>
          </div>
        </div>
        <div className="highlight-item">
          <Lock className="highlight-icon text-gold" size={24} />
          <div>
            <h4>Bank-Grade Security</h4>
            <p>256-bit SSL encrypted transactions</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="footer-main">
        <div className="footer-brand-section">
          <Link to="/" className="footer-brand">
            <div className="brand-icon-box small">
              <ShoppingBag size={18} />
            </div>
            <span className="brand-text">Nova<span className="brand-accent">Mart</span></span>
            <span className="brand-market-badge">MARKET</span>
          </Link>
          <p className="footer-tagline">
            The modern marketplace for curated tech, limited atelier drops, and living essentials. Redefining e-commerce with speed, style, and authenticity.
          </p>
          <div className="footer-social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link"><Instagram size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-link"><Twitter size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-link"><Youtube size={18} /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-link"><Github size={18} /></a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h5>Collections</h5>
            <ul>
              <li><Link to="/">Audio & Future Tech</Link></li>
              <li><Link to="/">Designer Atelier & Denim</Link></li>
              <li><Link to="/">Living & Studio Sanctuary</Link></li>
              <li><Link to="/">Athletics & Performance</Link></li>
              <li><Link to="/">New Arrivals & Drops</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Client Care</h5>
            <ul>
              <li><Link to="/orders">Order Tracking & Status</Link></li>
              <li><Link to="/profile">VIP Membership & Rewards</Link></li>
              <li><a href="#catalog">Authenticity Guarantee</a></li>
              <li><a href="#catalog">Shipping & Delivery Rates</a></li>
              <li><a href="#catalog">Returns & Exchange Portal</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Market Experience</h5>
            <ul>
              <li><span className="footer-badge-pill">Verified Authentic</span></li>
              <li><span className="footer-badge-pill">Carbon Neutral Delivery</span></li>
              <li><span className="footer-badge-pill">Curated Luxury Drops</span></li>
              <li><span className="footer-badge-pill">24/7 VIP Concierge</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>&copy; {new Date().getFullYear()} NovaMart Marketplace Inc. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#cookies">Cookie Preferences</a>
          </div>
        </div>

        {/* Accepted Payment Cards */}
        <div className="footer-payments-row">
          <span className="payment-chip">VISA</span>
          <span className="payment-chip">MASTERCARD</span>
          <span className="payment-chip">AMEX</span>
          <span className="payment-chip">APPLE PAY</span>
          <span className="payment-chip">PAYPAL</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

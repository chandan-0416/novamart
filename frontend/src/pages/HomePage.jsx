import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Flame,
  Star,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Gift,
  ArrowUpRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { fetchProducts, setPage, setFilter } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import Pagination from '../components/common/Pagination';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';
import './Pages.css';

const COLLECTIONS = [
  {
    id: 'electronics',
    title: 'Audio & Future Tech',
    subtitle: 'Flagship ANC, mechanical keys & action cams',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tag: 'HOT DROP'
  },
  {
    id: 'clothing',
    title: 'Modern Apparel & Atelier',
    subtitle: 'Heavyweight organic cottons & stretch denim',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    tag: 'NEW IN'
  },
  {
    id: 'home',
    title: 'Studio & Living Sanctuary',
    subtitle: 'Artisanal pour-over brewers & essentials',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    tag: 'ESSENTIALS'
  },
  {
    id: 'sports',
    title: 'Athletics & Movement',
    subtitle: 'Double-wall insulated gear & adventure essentials',
    category: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    tag: 'POPULAR'
  }
];

const REVIEWS = [
  {
    name: 'Marcus Vance',
    role: 'Verified Buyer • Tokyo',
    rating: 5,
    text: 'The ANC headphones arrived in 2 days in immaculate packaging. Soundstage is punchy and build quality feels like a $400 flagship.',
    product: 'Wireless Noise-Cancelling Headphones'
  },
  {
    name: 'Elena Rostova',
    role: 'Verified Buyer • Berlin',
    rating: 5,
    text: 'The heavyweight organic cotton tees have the perfect relaxed streetwear silhouette. Minimal shrinkage after washing. 10/10.',
    product: 'Organic Cotton Crewneck T-Shirt'
  },
  {
    name: 'Devon Miller',
    role: 'Verified Buyer • New York',
    rating: 5,
    text: 'Smooth ordering experience and instant tracking updates. The mechanical keyboard with tactile switches is easily my daily driver.',
    product: 'Mechanical Gaming Keyboard'
  }
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, pagination, isLoading, error, filters } = useSelector((state) => state.products);

  const [copiedCode, setCopiedCode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Live ticking countdown timer for Flash Deal
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 45 });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, filters.page]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCollectionClick = (categoryName) => {
    dispatch(setFilter({ category: categoryName }));
    dispatch(fetchProducts());
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyPromoCode = () => {
    navigator.clipboard?.writeText('NOVA20');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 4000);
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Editorial Hero Billboard Section */}
      <section className="hero-billboard-wrapper">
        <div className="hero-billboard-grid">
          {/* Main Hero Card */}
          <div className="hero-main-card glass-card">
            <div className="hero-badge-row">
              <span className="hero-capsule-badge">
                <Flame size={14} className="badge-icon-fire" />
                SPRING / SUMMER '26 EDIT
              </span>
              <span className="hero-live-pill">
                <span className="pulse-dot"></span>
                1,480 shopping now
              </span>
            </div>

            <h1 className="hero-headline">
              Curated Luxury & <br />
              <span className="text-gradient">Next-Gen Tech Drops</span>
            </h1>

            <p className="hero-subtext">
              Discover verified acoustics, designer apparel, and studio essentials engineered with obsessive craftsmanship and rapid dispatch.
            </p>

            <div className="hero-action-buttons">
              <a href="#catalog" className="btn btn-primary btn-lg">
                <span>Shop Latest Drops</span>
                <ArrowRight size={18} />
              </a>
              <button onClick={copyPromoCode} className="btn btn-secondary btn-lg coupon-hero-btn">
                <Tag size={16} className="text-pink" />
                <span>{copiedCode ? 'Copied "NOVA20"!' : '20% Off: NOVA20'}</span>
                {copiedCode ? <Check size={16} className="text-emerald" /> : <Copy size={15} />}
              </button>
            </div>

            {/* Credibility Stats Bar */}
            <div className="hero-credibility-strip">
              <div className="cred-stat">
                <div className="cred-rating">
                  <Star size={15} className="star-fill" />
                  <Star size={15} className="star-fill" />
                  <Star size={15} className="star-fill" />
                  <Star size={15} className="star-fill" />
                  <Star size={15} className="star-fill" />
                </div>
                <span><strong>4.9/5</strong> from 12k+ reviews</span>
              </div>
              <div className="cred-divider"></div>
              <div className="cred-stat">
                <ShieldCheck size={16} className="text-cyan" />
                <span>100% Authentic Guaranteed</span>
              </div>
              <div className="cred-divider"></div>
              <div className="cred-stat">
                <Truck size={16} className="text-emerald" />
                <span>24h Rapid Dispatch</span>
              </div>
            </div>
          </div>

          {/* Hero Side Drops Billboard */}
          <div className="hero-side-billboard">
            <div
              className="side-drop-card glass-card"
              onClick={() => handleCollectionClick('Electronics')}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80')` }}
            >
              <div className="drop-card-overlay">
                <span className="drop-card-pill">🔥 SPOTLIGHT DROP</span>
                <h3>Acoustic Flagships</h3>
                <p>Up to 25% off wireless ANC headphones</p>
                <span className="drop-explore-link">
                  <span>Explore Tech</span>
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>

            <div
              className="side-drop-card glass-card"
              onClick={() => handleCollectionClick('Clothing')}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80')` }}
            >
              <div className="drop-card-overlay">
                <span className="drop-card-pill">✨ NEW ATELIER</span>
                <h3>Minimalist Denim & Tees</h3>
                <p>Heavyweight 100% organic cotton</p>
                <span className="drop-explore-link">
                  <span>Explore Apparel</span>
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Trust & Feature Ribbon */}
      <section className="marketplace-pillars-ribbon">
        <div className="pillar-card glass-card">
          <div className="pillar-icon-box">
            <Truck size={22} className="pillar-icon text-cyan" />
          </div>
          <div>
            <h4>Express Worldwide Courier</h4>
            <p>Tracked delivery in 24-48 hours on orders $100+</p>
          </div>
        </div>

        <div className="pillar-card glass-card">
          <div className="pillar-icon-box">
            <ShieldCheck size={22} className="pillar-icon text-emerald" />
          </div>
          <div>
            <h4>100% Verified Authenticity</h4>
            <p>Every piece is inspected for pristine quality</p>
          </div>
        </div>

        <div className="pillar-card glass-card">
          <div className="pillar-icon-box">
            <RotateCcw size={22} className="pillar-icon text-pink" />
          </div>
          <div>
            <h4>30-Day Effortless Returns</h4>
            <p>Pre-paid labels & instant one-click refunds</p>
          </div>
        </div>

        <div className="pillar-card glass-card">
          <div className="pillar-icon-box">
            <Sparkles size={22} className="pillar-icon text-gold" />
          </div>
          <div>
            <h4>VIP Drop Club Benefits</h4>
            <p>Earn reward tokens & unlock private releases</p>
          </div>
        </div>
      </section>

      {/* Curated Visual Collections Grid */}
      <section className="collections-showcase-section">
        <div className="section-head-bar">
          <div>
            <span className="section-overhead-badge">CURATED CATEGORIES</span>
            <h2 className="section-headline">Shop by Aesthetic & Purpose</h2>
          </div>
          <p className="section-head-desc">
            Explore curated design collections tailored for modern lifestyles.
          </p>
        </div>

        <div className="collections-grid">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="collection-tile glass-card"
              onClick={() => handleCollectionClick(col.category)}
            >
              <img src={col.image} alt={col.title} className="collection-tile-bg" loading="lazy" />
              <div className="collection-tile-scrim"></div>
              <div className="collection-tile-content">
                <span className="collection-tag">{col.tag}</span>
                <h3 className="collection-title">{col.title}</h3>
                <p className="collection-subtitle">{col.subtitle}</p>
                <div className="collection-action">
                  <span>Browse {col.category}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale / Limited Drop Countdown Ribbon */}
      <section className="flash-deal-banner glass-card">
        <div className="flash-deal-content">
          <div className="flash-deal-info">
            <div className="flash-badge-row">
              <span className="badge badge-deal"><Zap size={13} /> LIMITED FLASH DROP</span>
              <span className="flash-discount-text">EXTRA 20% OFF AT CHECKOUT</span>
            </div>
            <h3 className="flash-title">Limited Release Spring Catalog Event</h3>
            <p className="flash-desc">Use code at checkout to unlock savings on top audio, apparel, and home pieces.</p>
          </div>

          <div className="flash-deal-interactive">
            <div className="countdown-clock">
              <div className="countdown-unit">
                <span className="unit-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="unit-label">HOURS</span>
              </div>
              <span className="countdown-colon">:</span>
              <div className="countdown-unit">
                <span className="unit-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="unit-label">MINS</span>
              </div>
              <span className="countdown-colon">:</span>
              <div className="countdown-unit">
                <span className="unit-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="unit-label">SECS</span>
              </div>
            </div>

            <button onClick={copyPromoCode} className="btn btn-primary coupon-copy-btn">
              <Tag size={16} />
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code: NOVA20'}</span>
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </section>

      {/* Live Catalog Section */}
      <section id="catalog" className="catalog-section">
        <div className="section-head-bar">
          <div>
            <span className="section-overhead-badge">THE COMPLETE CATALOG</span>
            <h2 className="section-headline">Explore All Drops</h2>
          </div>
          <p className="section-head-desc">
            Live inventory with instant category filtering, price adjustments, and real-time stock status.
          </p>
        </div>

        {/* Filter Toolbar */}
        <ProductFilter />

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner message="Curating catalog..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />
        ) : products.length === 0 ? (
          <div className="empty-catalog-box glass-card">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>No products found in this filter</h3>
            <p>Try clearing your category selection or adjusting your price parameters to view more drops.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </section>

      {/* Community Testimonials & Social Proof */}
      <section className="testimonials-section">
        <div className="section-head-bar center-head">
          <span className="section-overhead-badge">COMMUNITY REVIEWS</span>
          <h2 className="section-headline">Endorsed by Modern Tastemakers</h2>
          <p className="section-head-desc">
            Over 50,000 satisfied customers across 40+ countries.
          </p>
        </div>

        <div className="testimonials-grid">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="testimonial-card glass-card">
              <div className="testimonial-rating">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} className="star-fill" />
                ))}
              </div>
              <p className="testimonial-quote">"{rev.text}"</p>
              <div className="testimonial-footer">
                <div className="reviewer-info">
                  <span className="reviewer-name">{rev.name}</span>
                  <span className="reviewer-role">{rev.role}</span>
                </div>
                <span className="reviewed-product-tag">{rev.product}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Drop Club Newsletter Banner */}
      <section className="vip-newsletter-section">
        <div className="vip-newsletter-card glass-card">
          <div className="vip-newsletter-content">
            <span className="badge badge-admin"><Sparkles size={12} /> NOVA VIP ACCESS</span>
            <h3 className="vip-title">Join the NovaMart VIP Drop Club</h3>
            <p className="vip-desc">
              Subscribe to receive exclusive invites to secret capsule drops, private discount codes, and 15% off your first purchase.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="vip-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                <span>Unlock 15% Off</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {newsletterSubscribed && (
              <div className="newsletter-success-toast animate-fade-in">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Welcome to the VIP Drop Club! Check your inbox for your 15% code.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

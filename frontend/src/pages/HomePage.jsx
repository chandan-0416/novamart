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
  Copy,
  Check,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { fetchProducts, setPage, setFilter } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import Pagination from '../components/common/Pagination';
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingSpinner';

const COLLECTIONS = [
  {
    id: 'electronics',
    title: 'Audio & Future Tech',
    subtitle: 'Flagship ANC headphones & gear',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tag: 'HOT DROP'
  },
  {
    id: 'clothing',
    title: 'Modern Apparel & Atelier',
    subtitle: 'Heavyweight organic cottons & denim',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    tag: 'NEW IN'
  },
  {
    id: 'home',
    title: 'Studio & Living Sanctuary',
    subtitle: 'Artisanal brewers & lifestyle essentials',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    tag: 'ESSENTIALS'
  },
  {
    id: 'sports',
    title: 'Athletics & Movement',
    subtitle: 'Insulated bottles & training gear',
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
    text: 'The ANC headphones arrived in 2 days in immaculate packaging. Soundstage is punchy and build quality feels like a true flagship.',
    product: 'Wireless ANC Headphones'
  },
  {
    name: 'Elena Rostova',
    role: 'Verified Buyer • Berlin',
    rating: 5,
    text: 'The heavyweight organic cotton tees have the perfect relaxed streetwear silhouette. Minimal shrinkage after washing. 10/10.',
    product: 'Organic Cotton Crewneck'
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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Flame size={14} className="text-amber-400" />
                SPRING / SUMMER '26 EDIT
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                1,480 customers shopping now
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Curated Luxury & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400">
                Next-Gen Tech Drops
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Discover verified acoustics, designer apparel, and studio essentials engineered with obsessive craftsmanship and rapid courier dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Shop Latest Drops</span>
                <ArrowRight size={18} />
              </a>
              <button
                onClick={copyPromoCode}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Tag size={16} className="text-pink-400" />
                <span>{copiedCode ? 'Copied "NOVA20"!' : '20% Off: NOVA20'}</span>
                {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>

            {/* Credibility Strip */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                </div>
                <span><strong className="text-white">4.9/5</strong> from 12k+ reviews</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>100% Authentic Guarantee</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Truck size={16} className="text-sky-400" />
                <span>24h Rapid Dispatch</span>
              </div>
            </div>
          </div>

          {/* Hero Side Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div
              onClick={() => handleCollectionClick('Electronics')}
              className="group relative rounded-2xl overflow-hidden border border-slate-800 cursor-pointer shadow-md bg-slate-800/80 h-44 flex flex-col justify-end p-5 transition-transform hover:scale-[1.02]"
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Acoustic Flagships"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Spotlight Drop
                </span>
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Acoustic Flagships</span>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs text-slate-300">Up to 25% off wireless ANC headphones</p>
              </div>
            </div>

            <div
              onClick={() => handleCollectionClick('Clothing')}
              className="group relative rounded-2xl overflow-hidden border border-slate-800 cursor-pointer shadow-md bg-slate-800/80 h-44 flex flex-col justify-end p-5 transition-transform hover:scale-[1.02]"
            >
              <img
                src="https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80"
                alt="Minimalist Denim"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
              />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded border border-pink-400/20">
                  New Atelier
                </span>
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Minimalist Denim & Tees</span>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs text-slate-300">Heavyweight 100% organic cotton</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Service Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Express Worldwide</h4>
            <p className="text-xs text-slate-500">Tracked shipping on orders $100+</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">100% Authentic</h4>
            <p className="text-xs text-slate-500">Verified factory genuine goods</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
            <RotateCcw size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">30-Day Returns</h4>
            <p className="text-xs text-slate-500">Effortless exchange or refund</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">VIP Club Perks</h4>
            <p className="text-xs text-slate-500">Exclusive member reward drops</p>
          </div>
        </div>
      </section>

      {/* Curated Categories Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Curated Categories</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">Shop by Aesthetic & Purpose</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Explore curated design collections tailored for modern tech, streetwear, and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.category)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-200 bg-slate-900 flex flex-col justify-end p-6"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="relative z-10 space-y-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur text-white px-2.5 py-0.5 rounded-full">
                  {col.tag}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">{col.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{col.subtitle}</p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-violet-300 group-hover:text-white transition-colors">
                  <span>Browse {col.category}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limited Flash Deal Countdown Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white mb-2">
            <Zap size={14} className="text-amber-300" /> LIMITED FLASH SALE
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Limited Release Spring Catalog Event</h3>
          <p className="text-sm text-violet-100 max-w-xl">
            Save an extra 20% on top electronics, luxury clothing, and home drops during this flash event.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/10">
            <div className="text-center px-2">
              <span className="block text-xl font-extrabold font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider text-violet-200">Hours</span>
            </div>
            <span className="text-xl font-bold text-violet-300">:</span>
            <div className="text-center px-2">
              <span className="block text-xl font-extrabold font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider text-violet-200">Mins</span>
            </div>
            <span className="text-xl font-bold text-violet-300">:</span>
            <div className="text-center px-2">
              <span className="block text-xl font-extrabold font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider text-violet-200">Secs</span>
            </div>
          </div>

          <button
            onClick={copyPromoCode}
            className="px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Tag size={15} className="text-violet-600" />
            <span>{copiedCode ? 'Code Copied!' : 'Copy Code: NOVA20'}</span>
            {copiedCode ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
          </button>
        </div>
      </section>

      {/* Complete Product Catalog */}
      <section id="catalog" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">The Complete Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">Explore All Drops</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Live inventory with instant category filtering, price adjustments, and real-time stock status.
          </p>
        </div>

        {/* Filters */}
        <ProductFilter />

        {/* Product Grid */}
        {isLoading ? (
          <LoadingSpinner message="Loading drops from live inventory..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or searching for something else.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </section>

      {/* Community Testimonials */}
      <section className="space-y-8 bg-slate-100/70 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-3xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Community Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Endorsed by Modern Tastemakers</h2>
          <p className="text-sm text-slate-500">
            Over 50,000 satisfied customers across 40+ countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">"{rev.text}"</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.role}</p>
                </div>
                <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Club Newsletter */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
            <Sparkles size={13} /> VIP DROP ACCESS
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Join the NovaMart VIP Drop Club</h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Subscribe to receive exclusive invites to secret capsule drops, private discount codes, and 15% off your first purchase.
          </p>
        </div>

        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto whitespace-nowrap px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Unlock 15% Off</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {newsletterSubscribed && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Welcome to the VIP Drop Club! Check your inbox for your 15% promo code.</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

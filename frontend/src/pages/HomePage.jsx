import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Flame,
  Star,
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
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, filters.page]);

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
                VERIFIED AUTHENTIC MARKETPLACE
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

            {/* Credibility Strip */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
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
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <div
              onClick={() => handleCollectionClick('Electronics')}
              className="group relative rounded-2xl overflow-hidden border border-slate-700/60 cursor-pointer shadow-md bg-slate-800 h-44 flex flex-col justify-end p-5 transition-transform hover:scale-[1.02]"
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Acoustic Flagships"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
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
              className="group relative rounded-2xl overflow-hidden border border-slate-700/60 cursor-pointer shadow-md bg-slate-800 h-44 flex flex-col justify-end p-5 transition-transform hover:scale-[1.02]"
            >
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80"
                alt="Minimalist Denim"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded border border-pink-400/20">
                  New Atelier
                </span>
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Minimalist Denim &amp; Tees</span>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs text-slate-300">Heavyweight 100% organic cotton</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Showcase */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Curated Categories</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">Shop by Aesthetic &amp; Purpose</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.category)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-200 bg-slate-900 flex flex-col justify-end p-6 transition-transform hover:scale-[1.02]"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="relative z-10 space-y-1.5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur text-white px-2.5 py-0.5 rounded-full">
                  {col.tag}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">{col.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{col.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Product Catalog */}
      <section id="catalog" className="space-y-6 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600">The Complete Catalog</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">Explore All Drops</h2>
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
    </div>
  );
};

export default HomePage;

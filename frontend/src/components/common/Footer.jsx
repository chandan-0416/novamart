import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Instagram,
  Twitter,
  Youtube,
  Github
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      {/* Top Value Propositions */}
      <div className="border-b border-slate-100 py-10 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Express Courier</h4>
                <p className="text-xs text-slate-500 mt-0.5">Fast, tracked dispatch on all orders</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">100% Authentic</h4>
                <p className="text-xs text-slate-500 mt-0.5">Verified original manufacturer quality</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
              <div className="p-2.5 rounded-lg bg-pink-50 text-pink-600">
                <RotateCcw size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">30-Day Returns</h4>
                <p className="text-xs text-slate-500 mt-0.5">Hassle-free replacement or refund</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">24/7 Dedicated Care</h4>
                <p className="text-xs text-slate-500 mt-0.5">Instant assistance & live tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Nova<span className="text-violet-600">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The modern marketplace for curated electronics, apparel, and lifestyle drops. Built for speed, reliability, and exceptional quality.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <Instagram size={17} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <Twitter size={17} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <Youtube size={17} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <Github size={17} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-violet-600 transition-colors">Electronics & Gear</Link></li>
              <li><Link to="/" className="hover:text-violet-600 transition-colors">Apparel & Denim</Link></li>
              <li><Link to="/" className="hover:text-violet-600 transition-colors">Home & Living</Link></li>
              <li><Link to="/" className="hover:text-violet-600 transition-colors">Sports & Outdoors</Link></li>
              <li><Link to="/" className="hover:text-violet-600 transition-colors">Books & Media</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Client Care</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/orders" className="hover:text-violet-600 transition-colors">Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-violet-600 transition-colors">Customer Account</Link></li>
              <li><a href="#terms" className="hover:text-violet-600 transition-colors">Shipping Rates</a></li>
              <li><a href="#terms" className="hover:text-violet-600 transition-colors">Return Policy</a></li>
              <li><a href="#terms" className="hover:text-violet-600 transition-colors">Privacy Notice</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Buyer Protection</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                100% Secure Checkout
              </p>
              <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Verified Quality Inspection
              </p>
              <div className="pt-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold text-[10px] rounded border border-slate-200">UPI</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold text-[10px] rounded border border-slate-200">CARDS</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold text-[10px] rounded border border-slate-200">NETBANKING</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold text-[10px] rounded border border-slate-200">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} NovaMart Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-slate-900 transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

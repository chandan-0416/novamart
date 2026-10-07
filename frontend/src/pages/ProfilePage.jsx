import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Shield, Calendar, PackageCheck, ShoppingBag, LogOut } from 'lucide-react';
import { fetchUserProfile, logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/orderSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pagination } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchOrders({ page: 1, limit: 1 }));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Account</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your profile details and view account stats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-violet-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              user?.role === 'admin' ? 'bg-pink-100 text-pink-700' : 'bg-violet-100 text-violet-700'
            }`}>
              {user?.role}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 pt-4 space-y-3 text-left text-xs">
            <div className="flex items-start gap-2.5 text-slate-600">
              <Mail size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                <span className="font-medium text-slate-900 truncate">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-600">
              <Shield size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Role</span>
                <span className="font-medium text-slate-900 capitalize">{user?.role} Access</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-600">
              <Calendar size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Member Since</span>
                <span className="font-medium text-slate-900">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recently joined'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Links / Stats */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PackageCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Orders Placed</h3>
                <p className="text-xs text-slate-500">Total purchases on this account</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900 block">{pagination?.totalItems || 0}</span>
              <Link to="/orders" className="text-xs font-bold text-violet-600 hover:text-violet-700">
                View All &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Explore Catalog</h3>
                <p className="text-xs text-slate-500">Discover newly released drops</p>
              </div>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              Shop Drops
            </Link>
          </div>

          {user?.role === 'admin' && (
            <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-200 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Admin Console</h3>
                  <p className="text-xs text-slate-600">Manage catalog, inventory, and orders</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-600/20"
              >
                Open Console
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

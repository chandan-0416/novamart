import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RotateCcw, ArrowUpDown } from 'lucide-react';
import { setFilter, resetFilters, fetchProducts } from '../../store/slices/productSlice';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Sports & Outdoors'
];

const ProductFilter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.products);

  const handleCategoryClick = (cat) => {
    const categoryValue = cat === 'All' ? '' : cat;
    dispatch(setFilter({ category: categoryValue }));
    dispatch(fetchProducts());
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilter({ [name]: value }));
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchProducts());
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    let sortBy = 'created_at';
    let sortOrder = 'DESC';

    if (value === 'price_asc') {
      sortBy = 'price';
      sortOrder = 'ASC';
    } else if (value === 'price_desc') {
      sortBy = 'price';
      sortOrder = 'DESC';
    } else if (value === 'name_asc') {
      sortBy = 'name';
      sortOrder = 'ASC';
    } else if (value === 'stock_desc') {
      sortBy = 'stock_quantity';
      sortOrder = 'DESC';
    }

    dispatch(setFilter({ sortBy, sortOrder }));
    dispatch(fetchProducts());
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(fetchProducts());
  };

  const getCurrentSortValue = () => {
    if (filters.sortBy === 'price' && filters.sortOrder === 'ASC') return 'price_asc';
    if (filters.sortBy === 'price' && filters.sortOrder === 'DESC') return 'price_desc';
    if (filters.sortBy === 'name' && filters.sortOrder === 'ASC') return 'name_asc';
    if (filters.sortBy === 'stock_quantity') return 'stock_desc';
    return 'newest';
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sortBy !== 'created_at';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-8 space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = (!filters.category && cat === 'All') || filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar (Price Range + Sorting + Reset) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Price Form */}
        <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Price:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              name="minPrice"
              placeholder="Min $"
              min="0"
              value={filters.minPrice}
              onChange={handlePriceChange}
              className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max $"
              min="0"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Apply
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={getCurrentSortValue()}
                onChange={handleSortChange}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer pr-4"
                aria-label="Sort products"
              >
                <option value="newest">Newest Drops</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="stock_desc">Highest Stock</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;

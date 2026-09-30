import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';
import { setFilter, resetFilters, fetchProducts } from '../../store/slices/productSlice';
import './Products.css';

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

  return (
    <div className="product-filter-container glass-card">
      {/* Category Pills */}
      <div className="filter-categories-scroll">
        {CATEGORIES.map((cat) => {
          const isSelected = (!filters.category && cat === 'All') || filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`category-pill ${isSelected ? 'active' : ''}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar (Price Range + Sorting + Reset) */}
      <div className="filter-toolbar">
        {/* Price Form */}
        <form onSubmit={handlePriceSubmit} className="price-filter-form">
          <span className="filter-label">Price:</span>
          <input
            type="number"
            name="minPrice"
            placeholder="Min $"
            min="0"
            value={filters.minPrice}
            onChange={handlePriceChange}
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max $"
            min="0"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="price-input"
          />
          <button type="submit" className="btn btn-secondary btn-sm filter-apply-btn">
            Apply
          </button>
        </form>

        {/* Sort Dropdown */}
        <div className="sort-dropdown-box">
          <ArrowUpDown size={16} className="sort-icon" />
          <select
            value={getCurrentSortValue()}
            onChange={handleSortChange}
            className="sort-select"
            aria-label="Sort products"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="stock_desc">Highest Stock</option>
          </select>
        </div>

        {/* Reset Button */}
        {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sortBy !== 'created_at') && (
          <button onClick={handleReset} className="reset-filter-btn" title="Reset all filters">
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;

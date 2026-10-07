import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save } from 'lucide-react';
import { createProduct, updateProduct } from '../../store/slices/productSlice';

const CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Home & Kitchen' },
  { id: 4, name: 'Books' },
  { id: 5, name: 'Sports & Outdoors' }
];

const ProductModal = ({ isOpen, onClose, productToEdit = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: 1,
    image_url: '',
    is_active: true
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        stock_quantity: productToEdit.stock_quantity || '',
        category_id: productToEdit.category_id || 1,
        image_url: productToEdit.image_url || '',
        is_active: productToEdit.is_active !== undefined ? productToEdit.is_active : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: 10,
        category_id: 1,
        image_url: '',
        is_active: true
      });
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please provide a valid positive price');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity || '0', 10),
        category_id: parseInt(formData.category_id, 10),
        image_url: formData.image_url.trim() || null,
        is_active: formData.is_active
      };

      if (productToEdit) {
        await dispatch(updateProduct({ id: productToEdit.id, data: payload })).unwrap();
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }

      onClose();
    } catch (err) {
      setError(err || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-base text-slate-900">
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless ANC Headphones"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="199.99"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Stock *</label>
              <input
                type="number"
                name="stock_quantity"
                min="0"
                required
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <span>Active in Catalog</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product highlights and specifications..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
            >
              <Save size={14} />
              <span>{isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

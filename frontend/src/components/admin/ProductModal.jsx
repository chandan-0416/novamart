import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, Plus } from 'lucide-react';
import { createProduct, updateProduct } from '../../store/slices/productSlice';
import './Admin.css';

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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && <div className="modal-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sony WH-1000XM5 Headphones"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="199.99"
              />
            </div>

            <div className="form-group">
              <label>Initial Stock *</label>
              <input
                type="number"
                name="stock_quantity"
                min="0"
                required
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="50"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <label htmlFor="is_active">Active in Catalog</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product specifications and highlights..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

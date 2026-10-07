import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../components/products/ProductCard';
import authReducer from '../store/slices/authSlice';
import cartReducer from '../store/slices/cartSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Crisp sound with active ANC.',
    price: 3499.00,
    stock_quantity: 15,
    category_name: 'Electronics',
    image_url: 'https://example.com/headphones.jpg',
  };

  it('renders product details correctly', () => {
    const store = createMockStore({
      auth: { isAuthenticated: true },
      cart: { items: [] },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    expect(screen.getByText('₹3499.00')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('15 available')).toBeInTheDocument();
  });

  it('displays out of stock message when quantity is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 };
    const store = createMockStore({
      auth: { isAuthenticated: true },
      cart: { items: [] },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={outOfStockProduct} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Sold Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Out of stock/i)).toBeInTheDocument();
  });
});

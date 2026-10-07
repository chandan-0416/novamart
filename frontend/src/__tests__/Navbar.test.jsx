import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../components/common/Navbar';
import authReducer from '../store/slices/authSlice';
import productReducer from '../store/slices/productSlice';
import cartReducer from '../store/slices/cartSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productReducer,
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

describe('Navbar Component', () => {
  it('renders brand name and navigation items', () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false },
      cart: { items: [], totalItems: 0 },
      products: { filters: { search: '' } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Nova')).toBeInTheDocument();
    expect(screen.getByText('Mart')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search drops/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('renders cart count badge when items are in cart', () => {
    const store = createMockStore({
      auth: { user: null, isAuthenticated: false },
      cart: { items: [], totalItems: 3 },
      products: { filters: { search: '' } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders user details when authenticated', () => {
    const store = createMockStore({
      auth: {
        user: { name: 'Chandan', role: 'admin' },
        isAuthenticated: true,
      },
      cart: { items: [], totalItems: 0 },
      products: { filters: { search: '' } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Chandan')).toBeInTheDocument();
    expect(screen.getAllByText(/Admin/i).length).toBeGreaterThan(0);
  });
});

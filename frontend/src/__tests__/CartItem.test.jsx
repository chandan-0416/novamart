import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CartItem from '../components/cart/CartItem';
import cartReducer from '../store/slices/cartSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
  });
};

describe('CartItem Component', () => {
  const mockItem = {
    product_id: 1,
    name: 'Mechanical Gaming Keyboard',
    price: 89.99,
    quantity: 2,
    subtotal: 179.98,
    stock_quantity: 10,
    image_url: 'https://example.com/keyboard.jpg',
  };

  it('renders cart item info, quantity and subtotal', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <CartItem item={mockItem} />
      </Provider>
    );

    expect(screen.getByText('Mechanical Gaming Keyboard')).toBeInTheDocument();
    expect(screen.getByText('₹89.99 each')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('₹179.98')).toBeInTheDocument();
  });
});

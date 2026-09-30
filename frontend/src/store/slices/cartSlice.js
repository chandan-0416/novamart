import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(productId, quantity);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(productId, quantity);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item quantity');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeCartItem(productId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart();
      return { items: [], totalItems: 0, totalAmount: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleCartFulfilled = (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items || [];
      state.totalItems = action.payload.totalItems || 0;
      state.totalAmount = action.payload.totalAmount || 0;
      state.error = null;
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, handleCartFulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, handleCartFulfilled)
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, handleCartFulfilled)
      .addCase(removeCartItem.fulfilled, handleCartFulfilled)
      .addCase(clearCart.fulfilled, handleCartFulfilled);
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;

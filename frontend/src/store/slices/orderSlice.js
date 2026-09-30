import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../../api/orderApi';
import { fetchCart } from './cartSlice';

const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  orderSuccess: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      dispatch(fetchCart()); // Cart was emptied on server side
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrders(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(id);
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(id, status);
      dispatch(fetchOrders());
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderSuccess: (state) => {
      state.orderSuccess = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orderSuccess = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orderSuccess = false;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Order
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { resetOrderSuccess, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;

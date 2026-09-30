import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api/productApi';

const initialState = {
  products: [],
  selectedProduct: null,
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    page: 1,
    limit: 12,
  },
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().products;
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await productApi.getProducts(params);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);
      return response.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { dispatch, rejectWithValue }) => {
    try {
      const response = await productApi.createProduct(productData);
      dispatch(fetchProducts());
      return response.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await productApi.updateProduct(id, data);
      dispatch(fetchProducts());
      return response.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await productApi.deleteProduct(id);
      dispatch(fetchProducts());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'created_at',
        sortOrder: 'DESC',
        page: 1,
        limit: 12,
      };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, setPage, resetFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

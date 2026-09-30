import authReducer, { clearAuthError } from '../store/slices/authSlice';

describe('Auth Redux Slice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(expect.objectContaining({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    }));
  });

  it('should handle clearAuthError', () => {
    const stateWithError = { ...initialState, error: 'Invalid credentials' };
    const actual = authReducer(stateWithError, clearAuthError());
    expect(actual.error).toBeNull();
  });
});

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('authToken');
    if (!token) return rejectWithValue('No token found');

    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error) {
      Cookies.remove('authToken');
      return rejectWithValue('Session expired');
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signin`, { email, password });
      if (res.data.status) {
        Cookies.set('authToken', res.data.access_token, { expires: 10 });
        return {
          token: res.data.access_token,
          user: res.data.user,
        };
      }
      return rejectWithValue('Invalid sign-in details');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Sign-in failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name, role }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        role,
      });
      if (res.data.status) {
        Cookies.set('authToken', res.data.access_token, { expires: 10 });
        return {
          token: res.data.access_token,
          user: res.data.user,
        };
      }
      return rejectWithValue('Sign-up failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Sign-up failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const token = getState().auth.token;
  try {
    await axios.post(`${API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (_) {
    // Ignore errors on logout
  }
  Cookies.remove('authToken');
  return true
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Signin
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.loading = false;
      })
      .addCase(signin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch User
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.role = null;
        state.token = null;
        state.loading = false;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;

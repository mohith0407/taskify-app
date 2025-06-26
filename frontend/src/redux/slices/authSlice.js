// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import { decodeJWT } from '../../helpers/decodeJWT';

// Init from localStorage
const token = localStorage.getItem('token');
let user = null;
if (token) {
  const decoded = decodeJWT(token);
  if (decoded?.name && decoded?.email && decoded?.role) {
    user = decoded; // includes role
  }
}

const initialState = {
  user,     // { _id, name, email, role }
  token,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// REGISTER
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/register', userData);
    const token = res.data.token;
    const user = decodeJWT(token);
    localStorage.setItem('token', token);
    return { user, token };
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Registration failed');
  }
});

// LOGIN
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/login', userData);
    const token = res.data.token;
    const user = decodeJWT(token);
    localStorage.setItem('token', token);
    return { user, token };
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Login failed');
  }
});

// GET CURRENT USER (optional: full info from DB)
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/users/me'); // must return { _id, name, email, role }
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to load user info');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logoutReducer: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })

      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
      });
  }
});

export const { reset, logoutReducer } = authSlice.actions;
export default authSlice.reducer;

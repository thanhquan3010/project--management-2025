import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api/mockApi.js';

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const profile = await api.auth.getProfile();
  return profile;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const profile = await api.auth.login(credentials);
    return profile;
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to login');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await api.auth.logout();
  return null;
});

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
  const users = await api.auth.listUsers();
  return users;
});

const initialState = {
  currentUser: null,
  status: 'idle',
  error: null,
  users: [],
  usersStatus: 'idle',
  usersError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.currentUser = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.status = 'idle';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = 'loading';
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersStatus = 'failed';
        state.usersError = action.error.message;
      });
  },
});

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUsers = (state) => state.auth.users;

export default authSlice.reducer;

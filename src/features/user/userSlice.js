import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api/mockApi';

const initialState = {
  users: [],
  currentUser: null,
  teamMembers: [],
  loading: 'idle',
  error: null,
};

export const fetchTeamMembers = createAsyncThunk('user/fetchTeamMembers', async () => {
  const users = await api.auth.listUsers();
  return users;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser(state, action) {
      state.users.push(action.payload);
      state.teamMembers = state.users;
    },
    updateUser(state, action) {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.teamMembers = state.users;
    },
    removeUser(state, action) {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.teamMembers = state.users;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setTeamMembers(state, action) {
      state.teamMembers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.users = action.payload;
        state.teamMembers = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  addUser,
  updateUser,
  removeUser,
  setCurrentUser,
  setTeamMembers,
} = userSlice.actions;

export default userSlice.reducer;

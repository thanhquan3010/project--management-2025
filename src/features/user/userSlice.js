import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
  teamMembers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
      state.teamMembers = action.payload;
    },
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
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setCurrentUser,
  setTeamMembers,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;

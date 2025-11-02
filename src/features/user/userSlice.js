import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api/mockApi';
import { fetchUsers as refreshAuthUsers } from '../auth/authSlice';

const initialState = {
  teamMembers: [],
  roles: [],
  loading: 'idle',
  error: null,
  rolesStatus: 'idle',
  rolesError: null,
};

export const fetchTeamMembers = createAsyncThunk('user/fetchTeamMembers', async () => {
  const users = await api.auth.listUsers();
  return users;
});

export const fetchRoles = createAsyncThunk('user/fetchRoles', async () => {
  const roles = await api.roles.list();
  return roles;
});

export const createTeamMember = createAsyncThunk(
  'user/createTeamMember',
  async ({ name, email, roleId }, { rejectWithValue, dispatch }) => {
    try {
      const created = await api.auth.createUser({ name, email, roleId });
      dispatch(refreshAuthUsers());
      return created;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create team member');
    }
  },
);

export const updateTeamMember = createAsyncThunk(
  'user/updateTeamMember',
  async ({ id, updates }, { rejectWithValue, dispatch }) => {
    try {
      const updated = await api.auth.updateUser(id, updates);
      dispatch(refreshAuthUsers());
      return updated;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update team member');
    }
  },
);

export const deleteTeamMember = createAsyncThunk(
  'user/deleteTeamMember',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.auth.deleteUser(id);
      dispatch(refreshAuthUsers());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete team member');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
        state.teamMembers = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchRoles.pending, (state) => {
        state.rolesStatus = 'loading';
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesStatus = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesStatus = 'failed';
        state.rolesError = action.error.message;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.teamMembers.push(action.payload);
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.teamMembers.findIndex((member) => member.id === action.payload.id);
        if (index !== -1) {
          state.teamMembers[index] = action.payload;
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.teamMembers = state.teamMembers.filter((member) => member.id !== action.payload);
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setTeamMembers } = userSlice.actions;

export default userSlice.reducer;

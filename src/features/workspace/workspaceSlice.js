import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api/mockApi';

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: 'idle',
  error: null,
};

export const fetchWorkspaces = createAsyncThunk('workspace/fetchAll', async () => {
  const workspaces = await api.workspaces.list();
  return workspaces;
});

export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async (payload, { rejectWithValue }) => {
    try {
      const workspace = await api.workspaces.create(payload);
      return workspace;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create workspace');
    }
  },
);

export const updateWorkspaceAsync = createAsyncThunk(
  'workspace/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const workspace = await api.workspaces.update(id, updates);
      return workspace;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update workspace');
    }
  },
);

export const deleteWorkspaceAsync = createAsyncThunk(
  'workspace/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.workspaces.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete workspace');
    }
  },
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace(state, action) {
      state.currentWorkspace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.workspaces = action.payload;
        if (!state.currentWorkspace && state.workspaces.length) {
          state.currentWorkspace = state.workspaces[0];
        } else if (
          state.currentWorkspace &&
          !state.workspaces.some((workspace) => workspace.id === state.currentWorkspace.id)
        ) {
          state.currentWorkspace = state.workspaces[0] ?? null;
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
        state.currentWorkspace = action.payload;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
        const index = state.workspaces.findIndex((workspace) => workspace.id === action.payload.id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
          if (state.currentWorkspace?.id === action.payload.id) {
            state.currentWorkspace = action.payload;
          }
        }
      })
      .addCase(updateWorkspaceAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteWorkspaceAsync.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter((workspace) => workspace.id !== action.payload);
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = state.workspaces[0] ?? null;
        }
      })
      .addCase(deleteWorkspaceAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setCurrentWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

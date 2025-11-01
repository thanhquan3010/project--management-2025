import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaces(state, action) {
      state.workspaces = action.payload;
    },
    addWorkspace(state, action) {
      state.workspaces.push(action.payload);
    },
    updateWorkspace(state, action) {
      const index = state.workspaces.findIndex((workspace) => workspace.id === action.payload.id);
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
    },
    deleteWorkspace(state, action) {
      state.workspaces = state.workspaces.filter((workspace) => workspace.id !== action.payload);
      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = state.workspaces[0] ?? null;
      }
    },
    setCurrentWorkspace(state, action) {
      state.currentWorkspace = action.payload;
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
  setWorkspaces,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setCurrentWorkspace,
  setLoading,
  setError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

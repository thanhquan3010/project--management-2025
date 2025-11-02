import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api/mockApi';

const initialState = {
  projects: [],
  currentProject: null,
  loading: 'idle',
  error: null,
};

export const fetchProjects = createAsyncThunk('project/fetchAll', async () => {
  const projects = await api.projects.list();
  return projects;
});

export const createProjectAsync = createAsyncThunk(
  'project/create',
  async (payload, { rejectWithValue }) => {
    try {
      const project = await api.projects.create(payload);
      return project;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  },
);

export const updateProjectAsync = createAsyncThunk(
  'project/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const project = await api.projects.update(id, updates);
      return project;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  },
);

export const deleteProjectAsync = createAsyncThunk(
  'project/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.projects.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete project');
    }
  },
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.projects = action.payload;
        if (!state.currentProject && state.projects.length) {
          state.currentProject = state.projects[0];
        } else if (
          state.currentProject &&
          !state.projects.some((project) => project.id === state.currentProject.id)
        ) {
          state.currentProject = state.projects[0] ?? null;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProjectAsync.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.currentProject = action.payload;
      })
      .addCase(createProjectAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        const index = state.projects.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
          if (state.currentProject?.id === action.payload.id) {
            state.currentProject = action.payload;
          }
        }
      })
      .addCase(updateProjectAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = state.projects[0] ?? null;
        }
      })
      .addCase(deleteProjectAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setCurrentProject,
} = projectSlice.actions;

export default projectSlice.reducer;

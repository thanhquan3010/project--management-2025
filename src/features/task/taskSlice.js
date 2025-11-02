import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteProjectAsync } from '../project/projectSlice';
import { api } from '../../services/api/mockApi';

const initialState = {
  tasks: [],
  filteredTasks: [],
  filter: 'all',
  loading: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('task/fetchAll', async () => {
  const tasks = await api.tasks.list();
  return tasks;
});

export const createTaskAsync = createAsyncThunk(
  'task/create',
  async (payload, { rejectWithValue }) => {
    try {
      const task = await api.tasks.create(payload);
      return task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  },
);

export const updateTaskAsync = createAsyncThunk(
  'task/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const task = await api.tasks.update(id, updates);
      return task;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  },
);

export const deleteTaskAsync = createAsyncThunk(
  'task/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.tasks.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  },
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
      state.filteredTasks = applyFilter(state.tasks, state.filter);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.tasks = action.payload;
        state.filteredTasks = applyFilter(state.tasks, state.filter);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.filteredTasks = applyFilter(state.tasks, state.filter);
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.filteredTasks = applyFilter(state.tasks, state.filter);
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.filteredTasks = applyFilter(state.tasks, state.filter);
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.projectId !== action.payload);
        state.filteredTasks = applyFilter(state.tasks, state.filter);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

const applyFilter = (tasks, filter) => {
  if (filter === 'all') return tasks;
  return tasks.filter((task) => task.status === filter);
};

export const {
  setFilter,
} = taskSlice.actions;

export default taskSlice.reducer;

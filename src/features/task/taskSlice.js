import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  filteredTasks: [],
  filter: 'all',
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
      state.filteredTasks = applyFilter(state.tasks, state.filter);
    },
    addTask(state, action) {
      state.tasks.push(action.payload);
      state.filteredTasks = applyFilter(state.tasks, state.filter);
    },
    updateTask(state, action) {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.filteredTasks = applyFilter(state.tasks, state.filter);
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.filteredTasks = applyFilter(state.tasks, state.filter);
    },
    setFilter(state, action) {
      state.filter = action.payload;
      state.filteredTasks = applyFilter(state.tasks, state.filter);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

const applyFilter = (tasks, filter) => {
  if (filter === 'all') return tasks;
  return tasks.filter((task) => task.status === filter);
};

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;

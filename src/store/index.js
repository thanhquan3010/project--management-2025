import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspace/workspaceSlice';
import projectReducer from '../features/project/projectSlice';
import taskReducer from '../features/task/taskSlice';
import userReducer from '../features/user/userSlice';
import { saveToLocalStorage, STORAGE_KEYS } from '../utils/localStorage';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    project: projectReducer,
    task: taskReducer,
    user: userReducer,
  },
});

// Persist key slices to localStorage for a lightweight offline experience.
store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage(STORAGE_KEYS.WORKSPACES, state.workspace.workspaces);
  saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKSPACE, state.workspace.currentWorkspace);
  saveToLocalStorage(STORAGE_KEYS.PROJECTS, state.project.projects);
  saveToLocalStorage(STORAGE_KEYS.TASKS, state.task.tasks);
  saveToLocalStorage(STORAGE_KEYS.USERS, state.user.users);
});

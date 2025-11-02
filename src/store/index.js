import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspace/workspaceSlice';
import projectReducer from '../features/project/projectSlice';
import taskReducer from '../features/task/taskSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    project: projectReducer,
    task: taskReducer,
    user: userReducer,
    auth: authReducer,
  },
});

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import workspaceReducer from '../features/workspace/workspaceSlice';
import projectReducer from '../features/project/projectSlice';
import taskReducer from '../features/task/taskSlice';
import userReducer from '../features/user/userSlice';

export const createTestStore = (preloadedState) =>
  configureStore({
    reducer: {
      workspace: workspaceReducer,
      project: projectReducer,
      task: taskReducer,
      user: userReducer,
    },
    preloadedState,
  });

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {},
) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

import { describe, expect, beforeEach, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer, {
  createWorkspace,
  deleteWorkspaceAsync,
  fetchWorkspaces,
} from '../workspace/workspaceSlice';
import projectReducer, {
  deleteProjectAsync,
  fetchProjects,
} from '../project/projectSlice';
import taskReducer, {
  fetchTasks,
} from '../task/taskSlice';
import userReducer from '../user/userSlice';
import authReducer, {
  fetchUsers,
  loginUser,
  logoutUser,
} from '../auth/authSlice';
import { resetMockApi } from '../../services/api/mockApi';

const makeStore = () =>
  configureStore({
    reducer: {
      workspace: workspaceReducer,
      project: projectReducer,
      task: taskReducer,
      user: userReducer,
      auth: authReducer,
    },
  });

describe('application flows', () => {
  beforeEach(() => {
    resetMockApi();
  });

  it('logs in and logs out a user via auth slice', async () => {
    const store = makeStore();
    await store.dispatch(fetchUsers());

    await store.dispatch(
      loginUser({ email: 'alex@example.com', password: 'password123' }),
    ).unwrap();

    const loggedIn = store.getState().auth.currentUser;
    expect(loggedIn?.email).toBe('alex@example.com');
    expect(loggedIn?.role?.id).toBe('admin');

    await store.dispatch(logoutUser()).unwrap();
    expect(store.getState().auth.currentUser).toBeNull();
  });

  it('rejects invalid credentials', async () => {
    const store = makeStore();

    await expect(
      store.dispatch(loginUser({ email: 'alex@example.com', password: 'wrong' })).unwrap(),
    ).rejects.toBe('Invalid email or password');
    expect(store.getState().auth.currentUser).toBeNull();
  });

  it('creates and deletes a workspace, updating selection state', async () => {
    const store = makeStore();
    await store.dispatch(fetchWorkspaces());

    const created = await store
      .dispatch(createWorkspace({ name: 'QA Workspace', description: 'temporary' }))
      .unwrap();

    const { workspaces, currentWorkspace } = store.getState().workspace;
    expect(workspaces.some((workspace) => workspace.id === created.id)).toBeTruthy();
    expect(currentWorkspace?.id).toBe(created.id);

    await store.dispatch(deleteWorkspaceAsync(created.id)).unwrap();
    const stateAfterDelete = store.getState().workspace;
    expect(stateAfterDelete.workspaces.find((item) => item.id === created.id)).toBeUndefined();
    if (stateAfterDelete.workspaces.length) {
      expect(stateAfterDelete.currentWorkspace?.id).toBe(stateAfterDelete.workspaces[0].id);
    } else {
      expect(stateAfterDelete.currentWorkspace).toBeNull();
    }
  });

  it('removes project tasks when deleting a project', async () => {
    const store = makeStore();
    await Promise.all([
      store.dispatch(fetchProjects()),
      store.dispatch(fetchTasks()),
    ]);

    const initialTasks = store
      .getState()
      .task.tasks.filter((task) => task.projectId === '1');
    expect(initialTasks.length).toBeGreaterThan(0);

    await store.dispatch(deleteProjectAsync('1')).unwrap();

    const remainingTasks = store
      .getState()
      .task.tasks.filter((task) => task.projectId === '1');
    expect(remainingTasks).toHaveLength(0);
  });
});

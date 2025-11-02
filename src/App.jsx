import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import RequireAuth from './components/auth/RequireAuth';
import {
  fetchCurrentUser,
  fetchUsers as fetchAuthUsers,
} from './features/auth/authSlice';
import {
  fetchWorkspaces,
} from './features/workspace/workspaceSlice';
import { fetchProjects } from './features/project/projectSlice';
import { fetchTasks } from './features/task/taskSlice';
import { fetchTeamMembers } from './features/user/userSlice';
import { PERMISSIONS } from './constants/permissions';

const HomePage = lazy(() => import('./pages/HomePage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

const AppContent = () => {
  const dispatch = useDispatch();
  const workspaceStatus = useSelector((state) => state.workspace.loading);
  const projectStatus = useSelector((state) => state.project.loading);
  const taskStatus = useSelector((state) => state.task.loading);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchAuthUsers());
    dispatch(fetchTeamMembers());
    dispatch(fetchWorkspaces());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const isLoadingData =
    workspaceStatus === 'loading' || projectStatus === 'loading' || taskStatus === 'loading';

  const loadingFallback = (
    <div className="p-6 text-center text-gray-600">
      Loading workspace experience...
    </div>
  );

  return (
    <Router>
      <Suspense fallback={loadingFallback}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={(
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            )}
          >
            <Route index element={isLoadingData ? loadingFallback : <HomePage />} />
            <Route
              path="workspaces"
              element={isLoadingData ? loadingFallback : <WorkspacePage />}
            />
            <Route
              path="projects"
              element={isLoadingData ? loadingFallback : <ProjectPage />}
            />
            <Route path="tasks" element={isLoadingData ? loadingFallback : <TaskPage />} />
            <Route
              path="analytics"
              element={
                <RequireAuth permission={PERMISSIONS.VIEW_ANALYTICS}>
                  {isLoadingData ? loadingFallback : <AnalyticsPage />}
                </RequireAuth>
              }
            />
            <Route path="team" element={isLoadingData ? loadingFallback : <TeamPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
    <Toaster position="top-right" />
  </Provider>
);

export default App;

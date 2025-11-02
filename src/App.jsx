import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import {
  setWorkspaces,
  setCurrentWorkspace,
} from './features/workspace/workspaceSlice';
import {
  setProjects,
  setCurrentProject,
} from './features/project/projectSlice';
import { setTasks } from './features/task/taskSlice';
import { setUsers } from './features/user/userSlice';
import {
  loadFromLocalStorage,
  STORAGE_KEYS,
} from './utils/localStorage';
import { generateSampleData } from './utils/sampleData';

const HomePage = lazy(() => import('./pages/HomePage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const workspaces = loadFromLocalStorage(STORAGE_KEYS.WORKSPACES, []);
    const projects = loadFromLocalStorage(STORAGE_KEYS.PROJECTS, []);
    const tasks = loadFromLocalStorage(STORAGE_KEYS.TASKS, []);
    const users = loadFromLocalStorage(STORAGE_KEYS.USERS, []);
    const currentWorkspace = loadFromLocalStorage(
      STORAGE_KEYS.CURRENT_WORKSPACE,
      null,
    );

    if (workspaces.length || projects.length || tasks.length || users.length) {
      dispatch(setWorkspaces(workspaces));
      dispatch(setProjects(projects));
      dispatch(setTasks(tasks));
      dispatch(setUsers(users));
      if (currentWorkspace) {
        dispatch(setCurrentWorkspace(currentWorkspace));
        const workspaceProjects = projects.filter(
          (project) => project.workspaceId === currentWorkspace.id,
        );
        if (workspaceProjects.length) {
          dispatch(setCurrentProject(workspaceProjects[0]));
        }
      } else if (workspaces.length) {
        dispatch(setCurrentWorkspace(workspaces[0]));
        const workspaceProjects = projects.filter(
          (project) => project.workspaceId === workspaces[0].id,
        );
        if (workspaceProjects.length) {
          dispatch(setCurrentProject(workspaceProjects[0]));
        }
      }
      return;
    }

    const sample = generateSampleData();
    dispatch(setWorkspaces(sample.workspaces));
    dispatch(setProjects(sample.projects));
    dispatch(setTasks(sample.tasks));
    dispatch(setUsers(sample.users));
    if (sample.workspaces.length) {
      dispatch(setCurrentWorkspace(sample.workspaces[0]));
    }
    if (sample.projects.length) {
      dispatch(setCurrentProject(sample.projects[0]));
    }
  }, [dispatch]);

  return (
    <Router>
      <MainLayout>
        <Suspense
          fallback={(
            <div className="p-6 text-center text-gray-600">
              Loading workspace experience...
            </div>
          )}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workspaces" element={<WorkspacePage />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
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

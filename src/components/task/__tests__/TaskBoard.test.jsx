import { screen } from '@testing-library/react';
import TaskBoard from '../TaskBoard';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';

describe('TaskBoard', () => {
  const baseState = {
    workspace: { workspaces: [], currentWorkspace: null, loading: false, error: null },
    project: { projects: [], currentProject: null, loading: false, error: null },
    user: { users: [], currentUser: null, teamMembers: [], loading: false, error: null },
    task: {
      tasks: [
        { id: 't1', title: 'Design', status: 'pending', priority: 'high' },
        { id: 't2', title: 'Build', status: 'in-progress', priority: 'medium' },
      ],
      filteredTasks: [
        { id: 't1', title: 'Design', status: 'pending', priority: 'high' },
        { id: 't2', title: 'Build', status: 'in-progress', priority: 'medium' },
      ],
      filter: 'all',
      loading: false,
      error: null,
    },
  };

  it('renders three columns by default', () => {
    renderWithProviders(<TaskBoard />, { preloadedState: baseState });
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('only renders selected column when filter is applied', () => {
    const filteredState = {
      ...baseState,
      task: {
        ...baseState.task,
        filteredTasks: baseState.task.tasks.filter((task) => task.status === 'in-progress'),
        filter: 'in-progress',
      },
    };

    renderWithProviders(<TaskBoard />, { preloadedState: filteredState });
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.queryByText('To Do')).not.toBeInTheDocument();
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });
});

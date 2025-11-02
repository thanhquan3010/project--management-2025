import userEvent from '@testing-library/user-event';
import { screen, act } from '@testing-library/react';
import WorkspaceList from '../WorkspaceList';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';

describe('WorkspaceList', () => {
  const baseState = {
    workspace: {
      workspaces: [
        { id: '1', name: 'Workspace One', description: 'First', projectCount: 1, memberCount: 2 },
        { id: '2', name: 'Workspace Two', description: 'Second', projectCount: 0, memberCount: 1 },
      ],
      currentWorkspace: null,
      loading: 'idle',
      error: null,
    },
    project: {
      projects: [
        { id: 'p1', name: 'Project Alpha', description: 'Alpha', workspaceId: '1', status: 'not-started' },
        { id: 'p2', name: 'Project Beta', description: 'Beta', workspaceId: '2', status: 'in-progress' },
      ],
      currentProject: null,
      loading: 'idle',
      error: null,
    },
    task: { tasks: [], filteredTasks: [], filter: 'all', loading: 'idle', error: null },
    user: { users: [], currentUser: null, teamMembers: [], loading: 'idle', error: null },
  };

  it('renders workspace cards', () => {
    renderWithProviders(<WorkspaceList />, { preloadedState: baseState });
    expect(screen.getByText('Workspace One')).toBeInTheDocument();
    expect(screen.getByText('Workspace Two')).toBeInTheDocument();
  });

  it('selects workspace and updates active badge', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<WorkspaceList />, { preloadedState: baseState });
    await act(async () => {
      await user.click(screen.getByText('Workspace One'));
    });

    const { workspace, project } = store.getState();
    expect(workspace.currentWorkspace?.id).toBe('1');
    expect(project.currentProject?.workspaceId).toBe('1');
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});

import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  FolderKanban,
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
  Clock3,
  Building2,
} from 'lucide-react';
import clsx from 'clsx';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ConfirmDialog from '../components/common/ConfirmDialog';
import WorkspaceList from '../components/workspace/WorkspaceList';
import CreateWorkspaceModal from '../components/workspace/CreateWorkspaceModal';
import EditWorkspaceModal from '../components/workspace/EditWorkspaceModal';
import CreateProjectModal from '../components/project/CreateProjectModal';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../constants/permissions';
import { deleteWorkspaceAsync } from '../features/workspace/workspaceSlice';
import { fetchProjects } from '../features/project/projectSlice';
import { fetchTasks } from '../features/task/taskSlice';

const normalizeStatus = (status) => (status ? status.toLowerCase() : '');

const statusDisplay = {
  'in-progress': 'In Progress',
  'not-started': 'Not Started',
  pending: 'Pending',
  completed: 'Completed',
  done: 'Completed',
  'on-hold': 'On Hold',
};

const statusBadgeStyles = {
  completed: 'bg-green-100 text-green-700',
  done: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  'not-started': 'bg-gray-100 text-gray-700',
  'on-hold': 'bg-purple-100 text-purple-700',
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) {
    return 'No due date';
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isTaskOverdue = (task) => {
  const dueDate = parseDate(task?.dueDate);
  if (!dueDate) {
    return false;
  }
  return normalizeStatus(task?.status) !== 'completed' && dueDate.getTime() < Date.now();
};

const sortByDueDateAsc = (list) =>
  [...list].sort((a, b) => {
    const dateA = parseDate(a.dueDate);
    const dateB = parseDate(b.dueDate);

    if (!dateA && !dateB) {
      return 0;
    }
    if (!dateA) {
      return 1;
    }
    if (!dateB) {
      return -1;
    }

    return dateA.getTime() - dateB.getTime();
  });

const WorkspacePage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  const { currentWorkspace, workspaces } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);
  const canManageWorkspaces = usePermission(PERMISSIONS.MANAGE_WORKSPACES);
  const canManageProjects = usePermission(PERMISSIONS.MANAGE_PROJECTS);
  const canManageTasks = usePermission(PERMISSIONS.MANAGE_TASKS);

  const handleConfirmWorkspaceDelete = async () => {
    if (!workspaceToDelete) {
      return;
    }
    try {
      await dispatch(deleteWorkspaceAsync(workspaceToDelete.id)).unwrap();
      dispatch(fetchProjects());
      dispatch(fetchTasks());
      toast.success('Workspace deleted successfully!');
    } catch (error) {
      toast.error(error || 'Failed to delete workspace');
    } finally {
      setWorkspaceToDelete(null);
    }
  };

  const hasSearchTerm = Boolean(searchTerm.trim());

  const workspaceProjects = useMemo(() => {
    if (!currentWorkspace) {
      return [];
    }
    return projects.filter((project) => project.workspaceId === currentWorkspace.id);
  }, [currentWorkspace, projects]);

  const filteredProjects = useMemo(() => {
    if (!hasSearchTerm) {
      return workspaceProjects;
    }
    const term = searchTerm.toLowerCase();
    return workspaceProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term),
    );
  }, [workspaceProjects, hasSearchTerm, searchTerm]);

  const projectsToDisplay = useMemo(
    () => (hasSearchTerm ? filteredProjects : filteredProjects.slice(0, 4)),
    [filteredProjects, hasSearchTerm],
  );

  const projectLookup = useMemo(() => {
    const lookup = {};
    workspaceProjects.forEach((project) => {
      lookup[project.id] = project;
    });
    return lookup;
  }, [workspaceProjects]);

  const workspaceProjectIds = useMemo(
    () => workspaceProjects.map((project) => project.id),
    [workspaceProjects],
  );

  const workspaceTasks = useMemo(() => {
    if (!workspaceProjectIds.length) {
      return [];
    }
    return tasks.filter((task) => workspaceProjectIds.includes(task.projectId));
  }, [tasks, workspaceProjectIds]);

  const filteredTasks = useMemo(() => {
    if (!hasSearchTerm) {
      return workspaceTasks;
    }
    const term = searchTerm.toLowerCase();
    return workspaceTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term),
    );
  }, [workspaceTasks, hasSearchTerm, searchTerm]);

  const metrics = useMemo(() => {
    const totalProjects = workspaceProjects.length;
    const completedProjects = workspaceProjects.filter(
      (project) => normalizeStatus(project.status) === 'completed' || normalizeStatus(project.status) === 'done',
    ).length;
    const activeTasks = workspaceTasks.filter(
      (task) => normalizeStatus(task.status) !== 'completed',
    );
    const overdueTasks = workspaceTasks.filter((task) => isTaskOverdue(task));
    const inProgressTasks = workspaceTasks.filter(
      (task) => normalizeStatus(task.status) === 'in-progress',
    );

    return {
      totalProjects,
      completedProjects,
      activeTasks: activeTasks.length,
      overdueTasks: overdueTasks.length,
      inProgressTasks: inProgressTasks.length,
      totalTasks: workspaceTasks.length,
    };
  }, [workspaceProjects, workspaceTasks]);

  const statsCards = useMemo(
    () => [
      {
        label: 'Total Projects',
        value: metrics.totalProjects,
        icon: FolderKanban,
        background: 'bg-blue-50',
        accent: 'text-blue-600',
      },
      {
        label: 'Completed Projects',
        value: metrics.completedProjects,
        icon: CheckCircle2,
        background: 'bg-emerald-50',
        accent: 'text-emerald-600',
      },
      {
        label: 'My Tasks',
        value: metrics.activeTasks,
        icon: ClipboardList,
        background: 'bg-primary-50',
        accent: 'text-primary-600',
      },
      {
        label: 'Overdue',
        value: metrics.overdueTasks,
        icon: AlertTriangle,
        background: 'bg-amber-50',
        accent: 'text-amber-600',
      },
    ],
    [metrics],
  );

  const myTasks = useMemo(
    () => sortByDueDateAsc(filteredTasks).slice(0, 4),
    [filteredTasks],
  );

  const overdueTasksList = useMemo(
    () => sortByDueDateAsc(filteredTasks.filter((task) => isTaskOverdue(task))).slice(0, 4),
    [filteredTasks],
  );

  const inProgressTasks = useMemo(
    () =>
      sortByDueDateAsc(
        filteredTasks.filter(
          (task) => normalizeStatus(task.status) === 'in-progress',
        ),
      ).slice(0, 4),
    [filteredTasks],
  );

  const recentActivity = useMemo(() => {
    const source = hasSearchTerm ? filteredTasks : workspaceTasks;
    if (!source.length) {
      return [];
    }
    const activity = [...source];
    activity.sort((a, b) => {
      const dateB = parseDate(b.createdAt) ?? parseDate(b.dueDate) ?? new Date(0);
      const dateA = parseDate(a.createdAt) ?? parseDate(a.dueDate) ?? new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    return activity.slice(0, 6);
  }, [filteredTasks, workspaceTasks, hasSearchTerm]);

  const hasWorkspace = Boolean(currentWorkspace);
  const hasProjects = workspaceProjects.length > 0;
  const hasTasks = workspaceTasks.length > 0;
  const showProjectLimitNotice =
    !hasSearchTerm && filteredProjects.length > projectsToDisplay.length;

  let projectOverviewContent = null;

  if (!hasWorkspace) {
    projectOverviewContent = (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <FolderKanban size={22} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">Create your first workspace</p>
          <p className="text-sm text-gray-600">
            Organize projects, tasks, and people in dedicated workspaces.
          </p>
        </div>
        <div className="flex justify-center">
          {canManageWorkspaces ? (
            <Button onClick={() => setIsWorkspaceModalOpen(true)}>
              <Plus size={18} className="mr-2" />
              New Workspace
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              Contact an administrator to create the first workspace.
            </p>
          )}
        </div>
      </div>
    );
  } else if (!hasProjects) {
    projectOverviewContent = (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <FolderKanban size={22} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">No projects yet</p>
          <p className="text-sm text-gray-600">
            Kickstart work in {currentWorkspace.name} by creating your first project.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => setIsProjectModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Create Project
          </Button>
        </div>
      </div>
    );
  } else if (!filteredProjects.length) {
    projectOverviewContent = (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center text-sm text-gray-600">
        No projects match "{searchTerm}". Try adjusting your search terms.
      </div>
    );
  } else {
    projectOverviewContent = (
      <div className="space-y-5">
        {projectsToDisplay.map((project) => {
          const status = normalizeStatus(project.status);
          const badgeClass = statusBadgeStyles[status] ?? 'bg-gray-100 text-gray-700';

          return (
            <div
              key={project.id}
              className="rounded-xl border border-gray-100 p-4 transition-colors hover:border-primary-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-gray-900">{project.name}</p>
                  {project.description && (
                    <p className="text-sm text-gray-600">{project.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {project.taskCount ?? 0} tasks &bull; {project.memberCount ?? 0} members
                  </p>
                </div>
                <span className={clsx('rounded-full px-3 py-1 text-xs font-medium', badgeClass)}>
                  {statusDisplay[status] ?? 'Planned'}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{project.completionRate ?? 0}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{ width: `${Math.min(project.completionRate ?? 0, 100)}%` }}
                  />
                </div>
                {project.deadline && (
                  <p className="mt-2 text-xs text-gray-500">Deadline: {formatDate(project.deadline)}</p>
                )}
              </div>
            </div>
          );
        })}

        {showProjectLimitNotice && (
          <p className="text-sm text-gray-500">
            Showing the first {projectsToDisplay.length} projects. Visit the Projects page to explore more.
          </p>
        )}
      </div>
    );
  }

  let myTasksContent = null;
  if (!hasWorkspace) {
    myTasksContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        Select or create a workspace to see tasks.
      </p>
    );
  } else if (!hasTasks) {
    myTasksContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        No tasks for this workspace yet. Create a project to start tracking work.
      </p>
    );
  } else if (!myTasks.length) {
    myTasksContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        {hasSearchTerm ? 'No tasks match your search.' : 'All caught up for now.'}
      </p>
    );
  } else {
    myTasksContent = (
      <div className="space-y-3">
        {myTasks.map((task) => {
          const status = normalizeStatus(task.status);
          const badgeClass = statusBadgeStyles[status] ?? 'bg-gray-100 text-gray-700';

          return (
            <div
              key={task.id}
              className="rounded-xl border border-gray-100 p-3 transition-colors hover:border-primary-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {projectLookup[task.projectId]?.name ?? 'Unassigned project'} &bull; Due {formatDate(task.dueDate)}
                  </p>
                </div>
                <span className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', badgeClass)}>
                  {statusDisplay[status] ?? 'Planned'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  let overdueContent = null;
  if (!hasWorkspace) {
    overdueContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        Select a workspace to review overdue work.
      </p>
    );
  } else if (!overdueTasksList.length) {
    overdueContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        {hasSearchTerm ? 'No overdue tasks match your search.' : 'No overdue tasks. Nice job!'}
      </p>
    );
  } else {
    overdueContent = (
      <div className="space-y-3">
        {overdueTasksList.map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{task.title}</p>
              <p className="text-xs text-amber-700">
                Due {formatDate(task.dueDate)} &bull; {projectLookup[task.projectId]?.name ?? 'Unassigned project'}
              </p>
            </div>
            <AlertTriangle size={18} className="mt-1 text-amber-500" />
          </div>
        ))}
      </div>
    );
  }

  let inProgressContent = null;
  if (!hasWorkspace) {
    inProgressContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        Select a workspace to view work in progress.
      </p>
    );
  } else if (!inProgressTasks.length) {
    inProgressContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        {hasSearchTerm ? 'No in-progress tasks match your search.' : 'Nothing in progress right now.'}
      </p>
    );
  } else {
    inProgressContent = (
      <div className="space-y-3">
        {inProgressTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-primary-100 bg-primary-50/60 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                <p className="text-xs text-primary-700">
                  {projectLookup[task.projectId]?.name ?? 'Unassigned project'} &bull; Due {formatDate(task.dueDate)}
                </p>
              </div>
              <Clock3 size={18} className="mt-1 text-primary-500" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  let activityContent = null;
  if (!hasWorkspace) {
    activityContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        Select a workspace to see recent activity.
      </p>
    );
  } else if (!recentActivity.length) {
    activityContent = (
      <p className="py-6 text-center text-sm text-gray-500">
        {hasSearchTerm ? 'No activity matches your search.' : 'Activity will appear here as work gets done.'}
      </p>
    );
  } else {
    activityContent = (
      <div className="space-y-4">
        {recentActivity.map((task) => {
          const status = normalizeStatus(task.status);
          return (
            <div key={task.id} className="flex items-start gap-4">
              <div className="mt-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Clock3 size={18} />
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {statusDisplay[status] ?? 'Updated'} • {formatDate(task.createdAt || task.dueDate)}
                </p>
                <p className="text-xs text-gray-500">
                  {projectLookup[task.projectId]?.name ?? 'Unassigned project'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {hasWorkspace
              ? `Welcome back${currentWorkspace.owner ? `, ${currentWorkspace.owner}` : ''}`
              : 'Welcome to ProjectHub'}
          </h1>
          <p className="mt-1 text-gray-600">
            {hasWorkspace
              ? `Here's what's happening in ${currentWorkspace.name} today.`
              : workspaces.length
              ? 'Select a workspace to dive into your projects and tasks.'
              : 'Create a workspace to start managing projects, tasks, and your team.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:h-full sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search projects, tasks..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          {canManageProjects && (
            <Button
              onClick={() => hasWorkspace && setIsProjectModalOpen(true)}
              disabled={!hasWorkspace}
              className="whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              New Project
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={clsx('flex h-12 w-12 items-center justify-center rounded-full', stat.background)}>
                  <stat.icon size={24} className={stat.accent} />
                </div>
              </div>
            ))}
          </div>

          <Card
            className="border border-gray-200 shadow-sm"
            title="Project Overview"
            actions={
              hasProjects && (
                <Link to="/projects">
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </Link>
              )
            }
          >
            {projectOverviewContent}
          </Card>

          <Card
            className="border border-gray-200 shadow-sm"
            title="Recent Activity"
            actions={
              hasTasks && (
                <Link to="/tasks">
                  <Button size="sm" variant="outline">
                    View Tasks
                  </Button>
                </Link>
              )
            }
          >
            {activityContent}
          </Card>

          <Card
            className="border border-gray-200 shadow-sm"
            title="Workspaces"
            actions={
              canManageWorkspaces ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsWorkspaceModalOpen(true)}
                  className="whitespace-nowrap"
                >
                  <Building2 size={16} className="mr-2" />
                  New Workspace
                </Button>
              ) : null
            }
          >
            <WorkspaceList
              onSelectWorkspace={() => setSearchTerm('')}
              onEditWorkspace={(workspace) => setEditingWorkspace(workspace)}
              onDeleteWorkspace={(workspace) => setWorkspaceToDelete(workspace)}
              canManageWorkspaces={canManageWorkspaces}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            className="border border-gray-200 shadow-sm"
            title="My Tasks"
            actions={
              hasWorkspace ? (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                  {metrics.totalTasks}
                </span>
              ) : null
            }
          >
            {myTasksContent}
          </Card>

          <Card
            className="border border-gray-200 shadow-sm"
            title="Overdue"
            actions={
              hasWorkspace ? (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                  {metrics.overdueTasks}
                </span>
              ) : null
            }
          >
            {overdueContent}
          </Card>

          <Card
            className="border border-gray-200 shadow-sm"
            title="In Progress"
            actions={
              hasWorkspace ? (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {metrics.inProgressTasks}
                </span>
              ) : null
            }
          >
            {inProgressContent}
          </Card>
        </div>
      </div>

      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />

      <EditWorkspaceModal
        isOpen={Boolean(editingWorkspace)}
        workspace={editingWorkspace}
        onClose={() => setEditingWorkspace(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(workspaceToDelete)}
        title="Delete Workspace"
        description={`This will delete "${workspaceToDelete?.name ?? ''}" and all associated projects and tasks.`}
        onCancel={() => setWorkspaceToDelete(null)}
        onConfirm={handleConfirmWorkspaceDelete}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};

export default WorkspacePage;


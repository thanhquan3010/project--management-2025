export const generateSampleData = () => {
  const workspaces = [
    {
      id: '1',
      name: 'My Company',
      description: 'Main workspace for company projects',
      projectCount: 3,
      memberCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Personal Projects',
      description: 'Personal side projects and experiments',
      projectCount: 2,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  const projects = [
    {
      id: '1',
      workspaceId: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      status: 'in-progress',
      completionRate: 45,
      taskCount: 12,
      memberCount: 3,
      deadline: '2025-12-31',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      workspaceId: '1',
      name: 'Mobile App Development',
      description: 'New mobile application for customers',
      status: 'in-progress',
      completionRate: 25,
      taskCount: 20,
      memberCount: 4,
      deadline: '2026-03-31',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      workspaceId: '2',
      name: 'Personal Blog',
      description: 'Build a personal blog with React',
      status: 'not-started',
      completionRate: 0,
      taskCount: 5,
      memberCount: 1,
      deadline: '2025-06-30',
      createdAt: new Date().toISOString(),
    },
  ];

  const tasks = [
    {
      id: '1',
      projectId: '1',
      title: 'Design homepage mockup',
      description: 'Create wireframes and mockups for the new homepage',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-11-15',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      projectId: '1',
      title: 'Implement navigation menu',
      description: 'Code the responsive navigation menu',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-11-20',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      projectId: '1',
      title: 'Set up footer section',
      description: 'Create and style the footer with links',
      status: 'pending',
      priority: 'medium',
      dueDate: '2025-11-25',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      projectId: '2',
      title: 'Setup React Native project',
      description: 'Initialize and configure the mobile app project',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-11-10',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      projectId: '2',
      title: 'Design app screens',
      description: 'Create UI designs for all app screens',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-11-30',
      createdAt: new Date().toISOString(),
    },
  ];

  const users = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'Project Manager',
      avatarColor: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Maria Gomez',
      email: 'maria@example.com',
      role: 'UX Designer',
      avatarColor: 'bg-pink-500',
    },
    {
      id: '3',
      name: 'Lee Wong',
      email: 'lee@example.com',
      role: 'Frontend Developer',
      avatarColor: 'bg-green-500',
    },
  ];

  return { workspaces, projects, tasks, users };
};

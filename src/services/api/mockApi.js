import { generateSampleData } from '../../utils/sampleData.js';

const createDelay = (min = 80, max = 200) =>
  new Promise((resolve) => {
    const timeout = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, timeout);
  });

const toPlainObject = (value) => JSON.parse(JSON.stringify(value));

const ROLES = [
  {
    id: 'admin',
    label: 'Administrator',
    permissions: [
      'manage:workspaces',
      'manage:projects',
      'manage:tasks',
      'view:analytics',
      'manage:team',
    ],
  },
  {
    id: 'manager',
    label: 'Project Manager',
    permissions: ['manage:projects', 'manage:tasks', 'view:analytics'],
  },
  {
    id: 'contributor',
    label: 'Contributor',
    permissions: ['manage:tasks'],
  },
  {
    id: 'viewer',
    label: 'Viewer',
    permissions: ['view:analytics'],
  },
];

const db = (() => {
  const sample = generateSampleData();
  const users = sample.users.map((user, index) => ({
    ...user,
    password: 'password123',
    roleId: index === 0 ? 'admin' : index === 1 ? 'manager' : 'contributor',
  }));
  return {
    workspaces: sample.workspaces,
    projects: sample.projects,
    tasks: sample.tasks,
    users,
    roles: ROLES,
    auth: {
      currentUserId: users[0]?.id ?? null,
    },
  };
})();

const findRole = (roleId) => db.roles.find((role) => role.id === roleId);

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }
  const plain = toPlainObject(user);
  const { password, ...rest } = plain;
  return {
    ...rest,
    roleId: user.roleId,
    role: findRole(user.roleId),
  };
};

const avatarPalette = ['bg-primary-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
const randomAvatarColor = () => avatarPalette[Math.floor(Math.random() * avatarPalette.length)];

const ensureProjectCounts = () => {
  db.workspaces.forEach((workspace) => {
    workspace.projectCount = db.projects.filter(
      (project) => project.workspaceId === workspace.id,
    ).length;
  });
  db.projects.forEach((project) => {
    project.taskCount = db.tasks.filter((task) => task.projectId === project.id).length;
  });
};

ensureProjectCounts();

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

const withDelay = async (fn) => {
  await createDelay();
  return fn();
};

const findUserByEmail = (email) =>
  db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

const authApi = {
  async login({ email, password }) {
    return withDelay(() => {
      const user = findUserByEmail(email);
      if (!user || user.password !== password) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }
      db.auth.currentUserId = user.id;
      return sanitizeUser(user);
    });
  },

  async logout() {
    return withDelay(() => {
      db.auth.currentUserId = null;
      return { success: true };
    });
  },

  async getProfile() {
    return withDelay(() => {
      const userId = db.auth.currentUserId;
      if (!userId) {
        return null;
      }
      const user = db.users.find((item) => item.id === userId);
      if (!user) {
        return null;
      }
      return sanitizeUser(user);
    });
  },

  async listUsers() {
    return withDelay(() => db.users.map(sanitizeUser));
  },

  async createUser(payload) {
    return withDelay(() => {
      const { name, email, roleId, password, avatarColor } = payload;
      if (!name || !email) {
        const error = new Error('Name and email are required');
        error.status = 400;
        throw error;
      }
      if (findUserByEmail(email)) {
        const error = new Error('Email already exists');
        error.status = 409;
        throw error;
      }
      const role = findRole(roleId) ?? findRole('contributor');
      if (!role) {
        const error = new Error('Invalid role');
        error.status = 400;
        throw error;
      }
      const newUser = {
        id: makeId(),
        name,
        email,
        roleId: role.id,
        password: password || 'password123',
        avatarColor: avatarColor || randomAvatarColor(),
        createdAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      return sanitizeUser(newUser);
    });
  },

  async updateUser(id, updates) {
    return withDelay(() => {
      const user = db.users.find((item) => item.id === id);
      if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }
      if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
        if (findUserByEmail(updates.email)) {
          const error = new Error('Email already exists');
          error.status = 409;
          throw error;
        }
      }
      if (updates.roleId) {
        const role = findRole(updates.roleId);
        if (!role) {
          const error = new Error('Invalid role');
          error.status = 400;
          throw error;
        }
        user.roleId = updates.roleId;
      }
      if (typeof updates.name === 'string') {
        user.name = updates.name;
      }
      if (typeof updates.email === 'string') {
        user.email = updates.email;
      }
      if (updates.avatarColor) {
        user.avatarColor = updates.avatarColor;
      }
      if (updates.password) {
        user.password = updates.password;
      }
      return sanitizeUser(user);
    });
  },

  async deleteUser(id) {
    return withDelay(() => {
      const index = db.users.findIndex((item) => item.id === id);
      if (index === -1) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }
      db.users.splice(index, 1);
      if (db.auth.currentUserId === id) {
        db.auth.currentUserId = null;
      }
      return { success: true, id };
    });
  },
};

const workspaceApi = {
  async list() {
    return withDelay(() => db.workspaces.map(toPlainObject));
  },

  async create(payload) {
    return withDelay(() => {
      const workspace = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        projectCount: 0,
        memberCount: payload.memberCount ?? 0,
        ...payload,
      };
      db.workspaces.push(workspace);
      return toPlainObject(workspace);
    });
  },

  async update(id, updates) {
    return withDelay(() => {
      const workspace = db.workspaces.find((item) => item.id === id);
      if (!workspace) {
        const error = new Error('Workspace not found');
        error.status = 404;
        throw error;
      }
      Object.assign(workspace, updates);
      return toPlainObject(workspace);
    });
  },

  async remove(id) {
    return withDelay(() => {
      const index = db.workspaces.findIndex((item) => item.id === id);
      if (index === -1) {
        const error = new Error('Workspace not found');
        error.status = 404;
        throw error;
      }
      const workspaceId = db.workspaces[index].id;
      db.workspaces.splice(index, 1);

      const projectsToRemove = db.projects.filter((project) => project.workspaceId === workspaceId);
      projectsToRemove.forEach((project) => {
        db.tasks = db.tasks.filter((task) => task.projectId !== project.id);
      });
      db.projects = db.projects.filter((project) => project.workspaceId !== workspaceId);

      return { success: true };
    });
  },
};

const projectApi = {
  async list() {
    return withDelay(() => db.projects.map(toPlainObject));
  },

  async create(payload) {
    return withDelay(() => {
      const project = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        taskCount: 0,
        memberCount: payload.memberCount ?? 0,
        completionRate: payload.completionRate ?? 0,
        status: payload.status ?? 'not-started',
        ...payload,
      };
      db.projects.push(project);
      ensureProjectCounts();
      return toPlainObject(project);
    });
  },

  async update(id, updates) {
    return withDelay(() => {
      const project = db.projects.find((item) => item.id === id);
      if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        throw error;
      }
      Object.assign(project, updates);
      ensureProjectCounts();
      return toPlainObject(project);
    });
  },

  async remove(id) {
    return withDelay(() => {
      const index = db.projects.findIndex((item) => item.id === id);
      if (index === -1) {
        const error = new Error('Project not found');
        error.status = 404;
        throw error;
      }
      const projectId = db.projects[index].id;
      db.projects.splice(index, 1);
      db.tasks = db.tasks.filter((task) => task.projectId !== projectId);
      ensureProjectCounts();
      return { success: true };
    });
  },
};

const taskApi = {
  async list() {
    return withDelay(() => db.tasks.map(toPlainObject));
  },

  async create(payload) {
    return withDelay(() => {
      const task = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        status: payload.status ?? 'pending',
        priority: payload.priority ?? 'medium',
        ...payload,
      };
      db.tasks.push(task);
      ensureProjectCounts();
      return toPlainObject(task);
    });
  },

  async update(id, updates) {
    return withDelay(() => {
      const task = db.tasks.find((item) => item.id === id);
      if (!task) {
        const error = new Error('Task not found');
        error.status = 404;
        throw error;
      }
      Object.assign(task, updates);
      ensureProjectCounts();
      return toPlainObject(task);
    });
  },

  async remove(id) {
    return withDelay(() => {
      const index = db.tasks.findIndex((item) => item.id === id);
      if (index === -1) {
        const error = new Error('Task not found');
        error.status = 404;
        throw error;
      }
      db.tasks.splice(index, 1);
      ensureProjectCounts();
      return { success: true };
    });
  },
};

export const api = {
  auth: authApi,
  workspaces: workspaceApi,
  projects: projectApi,
  tasks: taskApi,
  roles: {
    async list() {
      return withDelay(() => db.roles.map(toPlainObject));
    },
  },
};

export const resetMockApi = () => {
  const sample = generateSampleData();
  db.workspaces = sample.workspaces;
  db.projects = sample.projects;
  db.tasks = sample.tasks;
  db.users = sample.users.map((user, index) => ({
    ...user,
    password: 'password123',
    roleId: index === 0 ? 'admin' : index === 1 ? 'manager' : 'contributor',
  }));
  db.auth.currentUserId = db.users[0]?.id ?? null;
  ensureProjectCounts();
};

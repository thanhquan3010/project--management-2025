export const PERMISSIONS = {
  MANAGE_WORKSPACES: 'manage:workspaces',
  MANAGE_PROJECTS: 'manage:projects',
  MANAGE_TASKS: 'manage:tasks',
  MANAGE_TEAM: 'manage:team',
  VIEW_ANALYTICS: 'view:analytics',
};

export const ROLE_LABELS = {
  admin: 'Administrator',
  manager: 'Project Manager',
  contributor: 'Contributor',
  viewer: 'Viewer',
};

export const hasPermission = (role, permission) => {
  if (!role) {
    return false;
  }
  return role.permissions?.includes(permission) ?? false;
};

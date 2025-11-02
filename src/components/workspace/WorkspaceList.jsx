import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Building2, Users, FolderKanban } from 'lucide-react';
import { setCurrentWorkspace } from '../../features/workspace/workspaceSlice';
import { setCurrentProject } from '../../features/project/projectSlice';
import Card from '../common/Card';
import Badge from '../common/Badge';

const WorkspaceList = ({ onSelectWorkspace }) => {
  const dispatch = useDispatch();
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);

  const handleSelectWorkspace = (workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    const workspaceProjects = projects.filter(
      (project) => project.workspaceId === workspace.id,
    );
    dispatch(setCurrentProject(workspaceProjects[0] ?? null));
    onSelectWorkspace?.(workspace);
  };

  if (!workspaces.length) {
    return (
      <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
        No workspaces yet. Create your first workspace to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleSelectWorkspace(workspace)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{workspace.name}</h3>
                <p className="text-sm text-gray-500">{workspace.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FolderKanban size={16} />
              <span>{workspace.projectCount || 0} Projects</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} />
              <span>{workspace.memberCount || 0} Members</span>
            </div>
          </div>

          {currentWorkspace?.id === workspace.id && (
            <div className="mt-3">
              <Badge variant="primary" size="sm">
                Active
              </Badge>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default React.memo(WorkspaceList);

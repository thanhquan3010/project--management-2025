import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';

const WorkspaceOverview = ({ onCreateProject }) => {
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);

  if (!currentWorkspace) {
    return (
      <Card>
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Select a workspace</h3>
          <p className="text-sm text-gray-600">
            Choose a workspace to view its projects and activity.
          </p>
        </div>
      </Card>
    );
  }

  const workspaceProjects = projects.filter(
    (project) => project.workspaceId === currentWorkspace.id,
  );

  return (
    <Card title={currentWorkspace.name}>
      <div className="space-y-4">
        <p className="text-gray-600">{currentWorkspace.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
            <p className="text-sm text-primary-600 font-medium">Projects</p>
            <p className="text-2xl font-semibold text-primary-700">
              {workspaceProjects.length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Members</p>
            <p className="text-2xl font-semibold text-green-700">
              {currentWorkspace.memberCount ?? 0}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Created</p>
            <p className="text-2xl font-semibold text-blue-700">
              {new Date(currentWorkspace.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {onCreateProject && (
          <Button onClick={onCreateProject}>Create Project</Button>
        )}
      </div>
    </Card>
  );
};

export default WorkspaceOverview;

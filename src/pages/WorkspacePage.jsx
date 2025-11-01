import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import WorkspaceList from '../components/workspace/WorkspaceList';
import WorkspaceOverview from '../components/workspace/WorkspaceOverview';
import CreateWorkspaceModal from '../components/workspace/CreateWorkspaceModal';
import CreateProjectModal from '../components/project/CreateProjectModal';

const WorkspacePage = () => {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-600 mt-1">
            Manage your workspaces and their projects.
          </p>
        </div>
        <Button onClick={() => setIsWorkspaceModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Workspace
        </Button>
      </div>

      <WorkspaceOverview onCreateProject={() => setIsProjectModalOpen(true)} />

      <WorkspaceList onSelectWorkspace={() => {}} />

      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};

export default WorkspacePage;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import ProjectGrid from '../components/project/ProjectGrid';
import ProjectDetail from '../components/project/ProjectDetail';
import CreateProjectModal from '../components/project/CreateProjectModal';
import EditProjectModal from '../components/project/EditProjectModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../constants/permissions';
import { deleteProjectAsync } from '../features/project/projectSlice';
import { fetchWorkspaces } from '../features/workspace/workspaceSlice';
import { fetchTasks } from '../features/task/taskSlice';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const canManageProjects = usePermission(PERMISSIONS.MANAGE_PROJECTS);

  const handleConfirmDelete = async () => {
    if (!projectToDelete) {
      return;
    }
    try {
      await dispatch(deleteProjectAsync(projectToDelete.id)).unwrap();
      dispatch(fetchTasks());
      dispatch(fetchWorkspaces());
      toast.success('Project deleted successfully!');
    } catch (error) {
      toast.error(error || 'Failed to delete project');
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Browse projects for the selected workspace and track their progress.
          </p>
        </div>
        {canManageProjects && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectGrid
            onSelectProject={() => {}}
            onEditProject={(project) => setEditingProject(project)}
            onDeleteProject={(project) => setProjectToDelete(project)}
            canManageProjects={canManageProjects}
          />
        </div>
        <div>
          <ProjectDetail />
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditProjectModal
        isOpen={Boolean(editingProject)}
        project={editingProject}
        onClose={() => setEditingProject(null)}
      />
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        title="Delete Project"
        description={`This will remove the project "${projectToDelete?.name ?? ''}" and all associated tasks.`}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectPage;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import TaskFilters from '../components/task/TaskFilters';
import TaskBoard from '../components/task/TaskBoard';
import CreateTaskModal from '../components/task/CreateTaskModal';
import EditTaskModal from '../components/task/EditTaskModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../constants/permissions';
import { deleteTaskAsync } from '../features/task/taskSlice';
import { fetchProjects } from '../features/project/projectSlice';

const TaskPage = () => {
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDeletion, setTaskPendingDeletion] = useState(null);
  const canManageTasks = usePermission(PERMISSIONS.MANAGE_TASKS);

  const handleConfirmDelete = async () => {
    if (!taskPendingDeletion) {
      return;
    }
    try {
      await dispatch(deleteTaskAsync(taskPendingDeletion.id)).unwrap();
      dispatch(fetchProjects());
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error(error || 'Failed to delete task');
    } finally {
      setTaskPendingDeletion(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks.</p>
        </div>
        {canManageTasks && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            New Task
          </Button>
        )}
      </div>

      <TaskFilters />

      <TaskBoard
        canManageTasks={canManageTasks}
        onAddTask={() => setIsCreateModalOpen(true)}
        onEditTask={(task) => setEditingTask(task)}
        onDeleteTask={(task) => setTaskPendingDeletion(task)}
      />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
      <ConfirmDialog
        isOpen={Boolean(taskPendingDeletion)}
        title="Delete Task"
        description={`Are you sure you want to delete "${taskPendingDeletion?.title ?? ''}"? This action cannot be undone.`}
        onCancel={() => setTaskPendingDeletion(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TaskPage;

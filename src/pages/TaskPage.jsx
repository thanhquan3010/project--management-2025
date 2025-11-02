import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import TaskFilters from '../components/task/TaskFilters';
import TaskBoard from '../components/task/TaskBoard';
import CreateTaskModal from '../components/task/CreateTaskModal';

const TaskPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Task
        </Button>
      </div>

      <TaskFilters />

      <TaskBoard onAddTask={() => setIsCreateModalOpen(true)} />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default TaskPage;

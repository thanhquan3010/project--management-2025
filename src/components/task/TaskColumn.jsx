import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, status, tasks, onAddTask, onEditTask, onDeleteTask, canManageTasks }) => {
  const getColumnClasses = (state) => {
    const colors = {
      pending: 'bg-gray-100 border-gray-300',
      'in-progress': 'bg-blue-50 border-blue-300',
      completed: 'bg-green-50 border-green-300',
    };
    return colors[state] || 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`px-4 py-3 rounded-t-lg border-t-4 ${getColumnClasses(status)}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-white px-2 py-1 rounded text-sm font-medium">{tasks.length}</span>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 p-4 space-y-3 min-h-[400px] rounded-b-lg">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            canManageTasks={canManageTasks}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}

        {canManageTasks ? (
          <button
            type="button"
            onClick={() => onAddTask?.(status)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        ) : (
          <div className="w-full py-3 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm text-center">
            View only
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TaskColumn);

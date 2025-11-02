import React from 'react';
import { Calendar, User, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../common/Badge';

const TaskCard = React.memo(({ task, canManageTasks, onEditTask, onDeleteTask }) => {
  const getPriorityVariant = (priority) => {
    const variants = {
      low: 'default',
      medium: 'warning',
      high: 'danger',
    };
    return variants[priority] || 'default';
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    onEditTask?.(task);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDeleteTask?.(task);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex items-start justify-between mb-3 gap-3">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        {canManageTasks && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Edit task"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="mb-3">
        <Badge variant={getPriorityVariant(task.priority)} size="sm">
          {task.priority} priority
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;

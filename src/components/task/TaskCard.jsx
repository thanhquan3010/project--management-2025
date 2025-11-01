import React from 'react';
import { Calendar, User, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../common/Badge';

const TaskCard = React.memo(({ task }) => {
  const getPriorityVariant = (priority) => {
    const variants = {
      low: 'default',
      medium: 'warning',
      high: 'danger',
    };
    return variants[priority] || 'default';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        <button type="button" className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
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

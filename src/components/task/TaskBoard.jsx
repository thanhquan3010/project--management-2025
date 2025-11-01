import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ onAddTask }) => {
  const { filteredTasks, filter } = useSelector((state) => state.task);

  const columns = useMemo(
    () => [
      { id: 'pending', title: 'To Do', status: 'pending' },
      { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
      { id: 'completed', title: 'Done', status: 'completed' },
    ],
    [],
  );

  const visibleColumns = useMemo(
    () => (filter === 'all' ? columns : columns.filter((column) => column.status === filter)),
    [columns, filter],
  );

  const getTasksByStatus = useCallback(
    (status) => {
      if (filter === 'all') {
        return filteredTasks.filter((task) => task.status === status);
      }
      return filter === status ? filteredTasks : [];
    },
    [filteredTasks, filter],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {visibleColumns.map((column) => (
        <TaskColumn
          key={column.id}
          title={column.title}
          status={column.status}
          tasks={getTasksByStatus(column.status)}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
};

export default TaskBoard;

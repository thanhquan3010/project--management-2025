import React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../features/task/taskSlice';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'completed' },
];

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filter, tasks } = useSelector((state) => state.task);

  const getCountFor = (value) => {
    if (value === 'all') return tasks.length;
    return tasks.filter((task) => task.status === value).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => dispatch(setFilter(item.value))}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
            filter === item.value
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
          )}
        >
          {item.label}
          <span className="ml-2 text-xs font-semibold">
            {getCountFor(item.value)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;

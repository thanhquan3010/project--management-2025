import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TaskStatusChart = ({ tasks }) => {
  const statusCounts = {
    pending: tasks.filter((task) => task.status === 'pending').length,
    'in-progress': tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  };

  const data = [
    { name: 'To Do', value: statusCounts.pending, color: '#6b7280' },
    { name: 'In Progress', value: statusCounts['in-progress'], color: '#3b82f6' },
    { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskStatusChart;

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ProjectProgressChart = ({ projects }) => {
  const data = projects.map((project) => ({
    name: project.name.length > 15 ? `${project.name.substring(0, 15)}...` : project.name,
    progress: project.completionRate || 0,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="progress" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectProgressChart;

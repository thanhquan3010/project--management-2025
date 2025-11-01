import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';
import Card from '../common/Card';
import ProjectProgressChart from './ProjectProgressChart';
import TaskStatusChart from './TaskStatusChart';

const AnalyticsDashboard = () => {
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);
  const { teamMembers } = useSelector((state) => state.user);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Project Progress">
          <ProjectProgressChart projects={projects} />
        </Card>
        <Card title="Task Status">
          <TaskStatusChart tasks={tasks} />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

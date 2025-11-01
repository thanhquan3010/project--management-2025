import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const HomePage = () => {
  const { workspaces } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);

  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workspaces</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {workspaces.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {projects.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {tasks.filter((task) => task.status !== 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Recent Projects"
        actions={
          <Link to="/projects">
            <Button variant="outline" size="sm">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        }
      >
        {recentProjects.length ? (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
                <div className="text-sm font-medium text-primary-600">
                  {project.completionRate ?? 0}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No projects yet. Create your first project!
          </p>
        )}
      </Card>

      <Card
        title="Recent Tasks"
        actions={
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        }
      >
        {recentTasks.length ? (
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={task.status === 'completed'}
                    readOnly
                  />
                  <span className="text-gray-900">{task.title}</span>
                </div>
                <span
                  className={clsx(
                    'text-xs px-2 py-1 rounded-full',
                    task.priority === 'high' && 'bg-red-100 text-red-700',
                    task.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                    task.priority === 'low' && 'bg-gray-100 text-gray-700',
                  )}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No tasks yet. Create your first task!
          </p>
        )}
      </Card>
    </div>
  );
};

export default HomePage;

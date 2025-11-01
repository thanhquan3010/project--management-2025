import React from 'react';
import { Calendar, Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ProjectCard = ({ project, onClick }) => {
  const getStatusVariant = (status) => {
    const variants = {
      'not-started': 'default',
      'in-progress': 'primary',
      completed: 'success',
      'on-hold': 'warning',
    };
    return variants[status] || 'default';
  };

  const completionRate = project.completionRate || 0;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status?.replace('-', ' ') || 'not-started'}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-primary-600">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {project.deadline
                ? format(new Date(project.deadline), 'MMM dd, yyyy')
                : 'No deadline'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} />
              <span>{project.taskCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{project.memberCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;

import React from 'react';
import { Calendar, Users, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ProjectCard = ({ project, onClick, canManageProjects, onEditProject, onDeleteProject }) => {
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

  const handleEdit = (event) => {
    event.stopPropagation();
    onEditProject?.(project);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDeleteProject?.(project);
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status?.replace('-', ' ') || 'not-started'}
            </Badge>
          </div>
          {canManageProjects && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEdit}
                className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                aria-label="Edit project"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
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

export default React.memo(ProjectCard);

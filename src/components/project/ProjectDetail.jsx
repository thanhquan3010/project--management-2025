import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Users, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const statusLabels = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
  'on-hold': 'On Hold',
};

const statusVariant = {
  'not-started': 'default',
  'in-progress': 'primary',
  completed: 'success',
  'on-hold': 'warning',
};

const ProjectDetail = () => {
  const { currentProject } = useSelector((state) => state.project);

  if (!currentProject) {
    return (
      <Card>
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Select a project</h3>
          <p className="text-sm text-gray-600">
            Choose a project from the list to review its details.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={currentProject.name}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariant[currentProject.status]} size="md">
            {statusLabels[currentProject.status] || currentProject.status}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>
              {currentProject.deadline
                ? new Date(currentProject.deadline).toLocaleDateString()
                : 'No deadline'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={16} />
            <span>{currentProject.completionRate ?? 0}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{currentProject.memberCount ?? 0} members</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Description
          </h4>
          <p className="text-gray-600 mt-2">{currentProject.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Key Dates
          </h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>
              <strong>Created:</strong>{' '}
              {new Date(currentProject.createdAt).toLocaleString()}
            </li>
            <li>
              <strong>Deadline:</strong>{' '}
              {currentProject.deadline
                ? new Date(currentProject.deadline).toLocaleDateString()
                : 'Not set'}
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ProjectDetail;

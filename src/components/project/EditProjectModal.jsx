import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateProjectAsync, setCurrentProject } from '../../features/project/projectSlice';
import { fetchWorkspaces } from '../../features/workspace/workspaceSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../constants/permissions';

const statusOptions = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
];

const EditProjectModal = ({ project, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const canManageProjects = usePermission(PERMISSIONS.MANAGE_PROJECTS);
  const isReadOnly = !canManageProjects;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'not-started',
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name ?? '',
        description: project.description ?? '',
        status: project.status ?? 'not-started',
        deadline: project.deadline ? project.deadline.slice(0, 10) : '',
      });
      setErrors({});
    }
  }, [project]);

  const handleChange = (event) => {
    if (isReadOnly) {
      return;
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value) => {
    if (isReadOnly) {
      return;
    }
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'Project name is required';
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!project) {
      return;
    }
    if (isReadOnly) {
      toast.error('You do not have permission to manage projects.');
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updatedProject = await dispatch(
        updateProjectAsync({
          id: project.id,
          updates: {
            ...formData,
          },
        }),
      ).unwrap();
      dispatch(setCurrentProject(updatedProject));
      dispatch(fetchWorkspaces());
      toast.success('Project updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to update project');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canManageProjects}>
            Save Changes
          </Button>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isReadOnly}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={isReadOnly}
          />
        </div>

        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={handleStatusChange}
          disabled={isReadOnly}
        />

        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          disabled={isReadOnly}
        />

        {isReadOnly && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
            You do not have permission to edit projects.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default EditProjectModal;

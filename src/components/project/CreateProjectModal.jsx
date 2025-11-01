import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addProject, setCurrentProject } from '../../features/project/projectSlice';
import { updateWorkspace, setCurrentWorkspace } from '../../features/workspace/workspaceSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'not-started',
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!currentWorkspace) {
      newErrors.workspace = 'Select a workspace before creating a project';
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.workspace) {
        toast.error(newErrors.workspace);
      }
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      ...formData,
      workspaceId: currentWorkspace?.id,
      completionRate: 0,
      taskCount: 0,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    dispatch(addProject(newProject));
    if (currentWorkspace) {
      const updatedWorkspace = {
        ...currentWorkspace,
        projectCount: (currentWorkspace.projectCount || 0) + 1,
      };
      dispatch(updateWorkspace(updatedWorkspace));
      dispatch(setCurrentWorkspace(updatedWorkspace));
    }
    dispatch(setCurrentProject(newProject));
    toast.success('Project created successfully!');
    onClose();
    setFormData({
      name: '',
      description: '',
      status: 'not-started',
      deadline: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Website Redesign"
          error={errors.name}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the project"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={handleStatusChange}
        />

        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
        />
      </form>
    </Modal>
  );
};

export default CreateProjectModal;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createTaskAsync } from '../../features/task/taskSlice';
import { fetchProjects } from '../../features/project/projectSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { PERMISSIONS } from '../../constants/permissions';
import { usePermission } from '../../hooks/usePermission';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);
  const { teamMembers } = useSelector((state) => state.user);
  const canManageTasks = usePermission(PERMISSIONS.MANAGE_TASKS);
  const isReadOnly = !canManageTasks;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'pending', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  const assigneeOptions = teamMembers.map((member) => ({
    value: member.id,
    label: member.name,
  }));

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!currentProject) {
      newErrors.project = 'Select a project before creating a task';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isReadOnly) {
      toast.error('You do not have permission to manage tasks.');
      return;
    }
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.project) {
        toast.error(newErrors.project);
      }
      return;
    }

    const assignee = teamMembers.find((member) => member.id === formData.assignedTo);

    try {
      await dispatch(
        createTaskAsync({
          ...formData,
          assignedTo: assignee ? { id: assignee.id, name: assignee.name } : null,
          projectId: currentProject?.id,
        }),
      ).unwrap();
      dispatch(fetchProjects());
      toast.success('Task created successfully!');
      onClose();
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
      });
    } catch (error) {
      toast.error(error || 'Failed to create task');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canManageTasks}>
            {canManageTasks ? 'Create Task' : 'Read Only'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Design homepage mockup"
          error={errors.title}
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
            placeholder="Task details and requirements"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            disabled={isReadOnly}
          />

          <Dropdown
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
            disabled={isReadOnly}
          />
        </div>

        <Dropdown
          label="Assign To"
          options={assigneeOptions}
          value={formData.assignedTo}
          onChange={(value) => setFormData((prev) => ({ ...prev, assignedTo: value }))}
          placeholder="Select team member"
          disabled={isReadOnly}
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isReadOnly}
        />
        {!canManageTasks && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
            You are signed in with view-only permissions. Ask a project manager or admin to promote
            your role if you need to create tasks.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default CreateTaskModal;

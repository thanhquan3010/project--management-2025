import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateTaskAsync } from '../../features/task/taskSlice';
import { fetchProjects } from '../../features/project/projectSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../constants/permissions';

const defaultForm = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  assignedTo: '',
};

const EditTaskModal = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((state) => state.user);
  const canManageTasks = usePermission(PERMISSIONS.MANAGE_TASKS);
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedTo: task.assignedTo?.id || '',
      });
      setErrors({});
    } else {
      setFormData(defaultForm);
    }
  }, [task]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!task) {
      return;
    }
    if (!canManageTasks) {
      toast.error('You do not have permission to manage tasks.');
      return;
    }
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assignee = teamMembers.find((member) => member.id === formData.assignedTo);

    try {
      await dispatch(
        updateTaskAsync({
          id: task.id,
          updates: {
            ...formData,
            assignedTo: assignee ? { id: assignee.id, name: assignee.name } : null,
          },
        }),
      ).unwrap();
      dispatch(fetchProjects());
      toast.success('Task updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to update task');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canManageTasks}>
            Save Changes
          </Button>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          />
          <Dropdown
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
          />
        </div>

        <Dropdown
          label="Assign To"
          options={assigneeOptions}
          value={formData.assignedTo}
          onChange={(value) => setFormData((prev) => ({ ...prev, assignedTo: value }))}
          placeholder="Select team member"
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        {!canManageTasks && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
            You are signed in with view-only permissions. Only project managers or admins can edit
            tasks.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default EditTaskModal;

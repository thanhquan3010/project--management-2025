import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addTask } from '../../features/task/taskSlice';
import { updateProject, setCurrentProject } from '../../features/project/projectSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);
  const { teamMembers } = useSelector((state) => state.user);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.project) {
        toast.error(newErrors.project);
      }
      return;
    }

    const assignee = teamMembers.find((member) => member.id === formData.assignedTo);

    const newTask = {
      id: Date.now().toString(),
      ...formData,
      assignedTo: assignee ? { id: assignee.id, name: assignee.name } : null,
      projectId: currentProject?.id,
      createdAt: new Date().toISOString(),
    };

    dispatch(addTask(newTask));
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        taskCount: (currentProject.taskCount || 0) + 1,
      };
      dispatch(updateProject(updatedProject));
      dispatch(setCurrentProject(updatedProject));
    }
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
          <Button onClick={handleSubmit}>
            Create Task
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
      </form>
    </Modal>
  );
};

export default CreateTaskModal;

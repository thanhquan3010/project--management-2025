import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { createWorkspace } from '../../features/workspace/workspaceSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../constants/permissions';

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const canManageWorkspaces = usePermission(PERMISSIONS.MANAGE_WORKSPACES);
  const isReadOnly = !canManageWorkspaces;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.name.trim()) {
      newErrors.name = 'Workspace name is required';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isReadOnly) {
      toast.error('You do not have permission to manage workspaces.');
      return;
    }
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(
        createWorkspace({
          ...formData,
          memberCount: 1,
        }),
      ).unwrap();
      toast.success('Workspace created successfully!');
      onClose();
      setFormData({ name: '', description: '' });
    } catch (error) {
      toast.error(error || 'Failed to create workspace');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Workspace"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canManageWorkspaces}>
            {canManageWorkspaces ? 'Create Workspace' : 'Read Only'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Workspace Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., My Company"
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
            placeholder="Brief description of this workspace"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={isReadOnly}
          />
        </div>

        {!canManageWorkspaces && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
            You do not have permission to manage workspaces.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;

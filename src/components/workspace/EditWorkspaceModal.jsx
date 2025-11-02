import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateWorkspaceAsync } from '../../features/workspace/workspaceSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../constants/permissions';

const EditWorkspaceModal = ({ workspace, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const canManageWorkspaces = usePermission(PERMISSIONS.MANAGE_WORKSPACES);
  const isReadOnly = !canManageWorkspaces;
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name || '',
        description: workspace.description || '',
      });
      setErrors({});
    }
  }, [workspace]);

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
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = 'Workspace name is required';
    }
    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!workspace) {
      return;
    }
    if (isReadOnly) {
      toast.error('You do not have permission to manage workspaces.');
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(
        updateWorkspaceAsync({
          id: workspace.id,
          updates: { ...formData },
        }),
      ).unwrap();
      toast.success('Workspace updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to update workspace');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Workspace"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canManageWorkspaces}>
            Save Changes
          </Button>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Workspace Name"
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
        {isReadOnly && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
            You do not have permission to edit workspaces.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default EditWorkspaceModal;

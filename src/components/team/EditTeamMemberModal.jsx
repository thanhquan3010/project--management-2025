import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { fetchRoles, updateTeamMember } from '../../features/user/userSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';

const EditTeamMemberModal = ({ member, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { roles, rolesStatus } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && rolesStatus === 'idle') {
      dispatch(fetchRoles());
    }
  }, [dispatch, isOpen, rolesStatus]);

  useEffect(() => {
    if (isOpen && member) {
      setFormData({
        name: member.name ?? '',
        email: member.email ?? '',
        roleId: member.role?.id ?? member.roleId ?? '',
      });
      setErrors({});
    }
  }, [isOpen, member]);

  const roleId = currentUser?.role?.id;

  const availableRoles = useMemo(() => {
    if (!roleId) {
      return [];
    }
    if (roleId === 'admin') {
      return roles;
    }
    if (roleId === 'manager') {
      if (member?.id === currentUser?.id) {
        return roles.filter((role) => role.id === 'manager');
      }
      return roles.filter((role) => role.id === 'contributor');
    }
    if (roleId === 'contributor') {
      return roles.filter((role) => role.id === member?.role?.id);
    }
    return [];
  }, [roleId, roles, member, currentUser]);

  useEffect(() => {
    if (formData.roleId && availableRoles.every((role) => role.id !== formData.roleId)) {
      setFormData((prev) => ({ ...prev, roleId: availableRoles[0]?.id ?? '' }));
    }
  }, [availableRoles, formData.roleId]);

  const canEdit = Boolean(availableRoles.length);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, roleId: value }));
    if (errors.roleId) {
      setErrors((prev) => ({ ...prev, roleId: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!member) {
      return;
    }
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await dispatch(
        updateTeamMember({
          id: member.id,
          updates: {
            name: formData.name,
            email: formData.email,
            roleId: formData.roleId,
          },
        }),
      ).unwrap();
      toast.success('Team member updated!');
      onClose();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Team Member"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canEdit}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={!canEdit}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={!canEdit}
        />
        <Dropdown
          label="Role"
          options={availableRoles.map((role) => ({ value: role.id, label: role.label }))}
          value={formData.roleId}
          onChange={handleRoleChange}
          placeholder={availableRoles.length ? 'Select role' : 'No role changes allowed'}
          disabled={!canEdit}
        />
        {errors.roleId && <p className="text-sm text-red-600">{errors.roleId}</p>}
        {!canEdit && (
          <p className="text-sm text-gray-500">
            You do not have permission to change this member&apos;s role.
          </p>
        )}
      </form>
    </Modal>
  );
};

export default EditTeamMemberModal;

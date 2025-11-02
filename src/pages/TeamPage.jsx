import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TeamMemberCard from '../components/team/TeamMemberCard';
import AddTeamMemberModal from '../components/team/AddTeamMemberModal';
import EditTeamMemberModal from '../components/team/EditTeamMemberModal';
import { selectCurrentUser } from '../features/auth/authSlice';
import { deleteTeamMember } from '../features/user/userSlice';

const TeamPage = () => {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((state) => state.user);
  const currentUser = useSelector(selectCurrentUser);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const roleId = currentUser?.role?.id;

  const visibleMembers = useMemo(() => {
    if (!roleId || roleId === 'admin' || roleId === 'manager') {
      return teamMembers;
    }
    if (roleId === 'contributor') {
      return teamMembers.filter((member) => member.id === currentUser?.id);
    }
    return teamMembers;
  }, [teamMembers, roleId, currentUser]);

  const canAddMember = roleId === 'admin' || roleId === 'manager';
  const canDeleteMember = roleId === 'admin';

  const canEditMember = (member) => {
    if (!currentUser) {
      return false;
    }
    if (roleId === 'admin') {
      return true;
    }
    if (roleId === 'manager') {
      if (member.id === currentUser.id) {
        return true;
      }
      return member.role?.id === 'contributor';
    }
    if (roleId === 'contributor') {
      return member.id === currentUser.id;
    }
    return false;
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) {
      return;
    }
    try {
      await dispatch(deleteTeamMember(memberToDelete.id)).unwrap();
      toast.success('Team member removed');
    } catch (error) {
      toast.error(error);
    } finally {
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">
            Manage team members and their roles across the workspace.
          </p>
        </div>
        {canAddMember && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Add Member
          </Button>
        )}
      </div>

      {visibleMembers.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              canEdit={canEditMember(member)}
              canDelete={canDeleteMember && member.id !== currentUser?.id}
              onEdit={(selected) => setEditingMember(selected)}
              onDelete={(selected) => setMemberToDelete(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          No team members yet. Invite collaborators to your workspace.
        </div>
      )}

      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditTeamMemberModal
        isOpen={Boolean(editingMember)}
        member={editingMember}
        onClose={() => setEditingMember(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(memberToDelete)}
        title="Remove Team Member"
        description={`Are you sure you want to remove "${memberToDelete?.name ?? ''}" from the team?`}
        onCancel={() => setMemberToDelete(null)}
        onConfirm={handleDeleteMember}
        tone="danger"
      />
    </div>
  );
};

export default TeamPage;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import TeamMemberCard from '../components/team/TeamMemberCard';
import AddTeamMemberModal from '../components/team/AddTeamMemberModal';

const TeamPage = () => {
  const { teamMembers } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">
            Manage team members and their roles across the workspace.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Member
        </Button>
      </div>

      {teamMembers.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          No team members yet. Invite collaborators to your workspace.
        </div>
      )}

      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TeamPage;

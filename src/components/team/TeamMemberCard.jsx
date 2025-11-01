import React from 'react';
import { Mail } from 'lucide-react';
import Card from '../common/Card';

const TeamMemberCard = ({ member }) => {
  const initials = member.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
              member.avatarColor || 'bg-primary-500'
            }`}
          >
            {initials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} />
          <span>{member.email}</span>
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberCard;

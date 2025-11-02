import React from 'react';
import { Mail, Pencil, Trash2 } from 'lucide-react';
import Card from '../common/Card';

const TeamMemberCard = ({ member, canEdit = false, canDelete = false, onEdit, onDelete }) => {
  const initials = member.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
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
              <p className="text-sm text-gray-500">
                {typeof member.role === 'string' ? member.role : member.role?.label ?? 'Member'}
              </p>
            </div>
          </div>
          {(canEdit || canDelete) && (
            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  onClick={() => onEdit?.(member)}
                  aria-label={`Edit ${member.name}`}
                >
                  <Pencil size={16} />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => onDelete?.(member)}
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
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

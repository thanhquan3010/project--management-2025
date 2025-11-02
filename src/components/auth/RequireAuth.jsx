import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { hasPermission } from '../../constants/permissions';

const RequireAuth = ({ children, permission }) => {
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permission && !hasPermission(currentUser.role, permission)) {
    return (
      <div className="p-10 max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Insufficient Permissions</h2>
        <p className="text-gray-600">
          You do not have access to view this page. Contact an administrator if you believe this is
          an error.
        </p>
      </div>
    );
  }

  return children;
};

export default RequireAuth;

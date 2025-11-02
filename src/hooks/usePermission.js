import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice.js';
import { hasPermission } from '../constants/permissions.js';

export const usePermission = (permission) => {
  const currentUser = useSelector(selectCurrentUser);

  return useMemo(() => {
    if (!permission) {
      return Boolean(currentUser);
    }
    return hasPermission(currentUser?.role, permission);
  }, [currentUser, permission]);
};

export const useCurrentUser = () => useSelector(selectCurrentUser);

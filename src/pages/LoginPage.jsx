import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import {
  fetchCurrentUser,
  fetchUsers,
  loginUser,
  selectAuthError,
  selectAuthStatus,
  selectCurrentUser,
  selectUsers,
} from '../features/auth/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const users = useSelector(selectUsers);

  const [formState, setFormState] = useState({
    email: '',
    password: 'password123',
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCurrentUser());
    }
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, status, users.length]);

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.email || !formState.password) {
      toast.error('Enter your email and password');
      return;
    }
    dispatch(loginUser(formState));
  };

  if (currentUser && status === 'succeeded') {
    return <Navigate to="/" replace />;
  }

  const userOptions = users.map((user) => ({
    value: user.email,
    label: `${user.name} (${user.role?.label ?? 'Role'})`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">ProjectHub Login</h1>
          <p className="text-gray-600">
            Choose an account to continue. Default password is `password123`.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Dropdown
            label="Select Team Member"
            value={formState.email}
            options={userOptions}
            placeholder="Pick a user"
            onChange={(value) => setFormState((prev) => ({ ...prev, email: value }))}
          />

          <Input
            label="Password"
            type="password"
            value={formState.password}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, password: event.target.value }))
            }
          />

          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-xs text-gray-500 text-center">
          Sample roles: Admin can manage everything, Project Manager can manage projects and tasks,
          Contributor can manage tasks, Viewer can browse.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

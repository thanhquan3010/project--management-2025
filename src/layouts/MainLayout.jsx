import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Users,
  Menu,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { logoutUser, selectCurrentUser } from '../features/auth/authSlice';
import { PERMISSIONS, hasPermission } from '../constants/permissions';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Workspaces', href: '/workspaces', icon: Building2 },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, permission: PERMISSIONS.VIEW_ANALYTICS },
  { name: 'Team', href: '/team', icon: Users, permission: PERMISSIONS.MANAGE_TEAM },
];

const MainLayout = () => {
  const isCompact = useBreakpoint(1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const userInitials = useMemo(() => {
    if (!currentUser?.name) {
      return 'U';
    }
    return currentUser.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [currentUser]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (isCompact) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isCompact]);

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={clsx(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 lg:z-30',
          isCompact
            ? ['w-64', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']
            : isSidebarOpen
            ? 'w-64'
            : 'w-20',
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-primary-600">ProjectHub</h1>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {(currentUser ? navigation.filter((item) => !item.permission || hasPermission(currentUser.role, item.permission)) : navigation).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {isCompact && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={clsx(
          'transition-all duration-300',
          isCompact ? 'ml-0' : isSidebarOpen ? 'ml-64' : 'ml-20',
        )}
      >
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {navigation.find((nav) => nav.href === location.pathname)?.name || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-4 text-sm">
            {currentUser && (
              <>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    {currentUser.role?.label ?? 'Member'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">{userInitials}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:text-primary-600 hover:border-primary-200 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {!currentUser && (
              <Link
                to="/login"
                className="px-3 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

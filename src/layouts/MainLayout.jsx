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
  Sun,
  Moon,
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return true;
  });
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

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.body.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isCompact) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isCompact]);

  return (
    <div
      className={clsx(
        'min-h-screen transition-colors duration-300',
        isDarkMode
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100'
          : 'bg-gray-50 text-gray-900',
      )}
    >
      <aside
        className={clsx(
          'fixed left-0 top-0 h-full transition-all duration-300 z-40 lg:z-30 border-r backdrop-blur',
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-gray-200',
          isCompact
            ? ['w-64', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']
            : isSidebarOpen
            ? 'w-64'
            : 'w-20',
        )}
      >
        <div
          className={clsx(
            'h-16 flex items-center justify-between px-6 border-b transition-colors',
            isDarkMode ? 'border-slate-800' : 'border-gray-200',
          )}
        >
          {isSidebarOpen && (
            <h1 className={clsx('text-xl font-bold', isDarkMode ? 'text-slate-100' : 'text-primary-600')}>
              ProjectHub
            </h1>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isDarkMode ? 'hover:bg-slate-800/70 text-slate-100' : 'hover:bg-gray-100 text-gray-700',
            )}
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {(currentUser
            ? navigation.filter((item) => !item.permission || hasPermission(currentUser.role, item.permission))
            : []
          ).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? isDarkMode
                      ? 'bg-slate-800/80 text-slate-100'
                      : 'bg-primary-50 text-primary-700'
                    : isDarkMode
                    ? 'text-slate-200 hover:bg-slate-800/60'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
          {!currentUser && (
            <div
              className={clsx(
                'px-4 py-3 text-sm rounded-lg border border-dashed',
                isDarkMode ? 'text-slate-300 bg-slate-900/70 border-slate-800' : 'text-gray-500 bg-gray-50 border-gray-200',
              )}
            >
              Sign in to access workspace navigation.
            </div>
          )}
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
        <header
          className={clsx(
            'h-16 flex items-center justify-between px-6 border-b transition-colors backdrop-blur',
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-gray-200',
          )}
        >
          <h2 className={clsx('text-lg font-semibold', isDarkMode ? 'text-slate-100' : 'text-gray-900')}>
            {navigation.find((nav) => nav.href === location.pathname)?.name || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={handleToggleTheme}
              className={clsx(
                'p-2 rounded-lg border transition-colors',
                isDarkMode
                  ? 'border-slate-700 text-slate-100 bg-slate-900/80 hover:bg-slate-800/70'
                  : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100',
              )}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {currentUser && (
              <>
                <div className="text-right">
                  <p className={clsx('font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                    {currentUser.name}
                  </p>
                  <p className={clsx('text-xs uppercase tracking-wide', isDarkMode ? 'text-slate-400' : 'text-gray-500')}>
                    {currentUser.role?.label ?? 'Member'}
                  </p>
                </div>
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isDarkMode ? 'bg-neutral-800' : 'bg-primary-100',
                  )}
                >
                  <span className={clsx('font-medium', isDarkMode ? 'text-white' : 'text-primary-700')}>
                    {userInitials}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={clsx(
                    'px-3 py-2 border rounded-lg transition-colors',
                    isDarkMode
                      ? 'border-slate-700 text-slate-200 hover:text-slate-100 hover:border-slate-500 hover:bg-slate-800/60'
                      : 'border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200',
                  )}
                >
                  Logout
                </button>
              </>
            )}
            {!currentUser && (
              <Link
                to="/login"
                className={clsx(
                  'px-3 py-2 rounded-lg border transition-colors',
                  isDarkMode
                    ? 'border-slate-600 text-slate-100 hover:bg-slate-700'
                    : 'border-primary-200 text-primary-600 hover:bg-primary-50',
                )}
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

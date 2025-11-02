import React from 'react';
import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/20 hover:from-fuchsia-500 hover:via-purple-500 hover:to-indigo-500 focus-visible:ring-fuchsia-300',
    secondary:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-red-700 focus-visible:ring-rose-300',
    success:
      'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 focus-visible:ring-emerald-200',
    outline:
      'border border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:bg-white focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900',
    ghost:
      'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300 dark:text-slate-200 dark:hover:bg-slate-800',
    accent:
      'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white shadow-lg shadow-orange-400/25 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 focus-visible:ring-amber-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

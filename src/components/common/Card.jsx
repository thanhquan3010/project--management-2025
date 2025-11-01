import React from 'react';
import clsx from 'clsx';

const Card = ({
  children,
  title,
  actions,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx('bg-white rounded-lg shadow-md overflow-hidden', className)}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;

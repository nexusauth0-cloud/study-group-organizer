import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        {Icon ? <Icon size={32} className="text-gray-400" /> : <FiInbox size={32} className="text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">{title || 'Nothing here'}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 max-w-sm">{description}</p>}
      {action && <>{action}</>}
    </div>
  );
};

export default EmptyState;

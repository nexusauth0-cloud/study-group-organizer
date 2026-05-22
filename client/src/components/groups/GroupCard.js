import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiLock } from 'react-icons/fi';

const GroupCard = ({ group }) => {
  return (
    <Link to={`/groups/${group._id}`} className="card block hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary-600">{group.name?.charAt(0)}</span>
        </div>
        {group.isPrivate && <FiLock size={14} className="text-gray-400" />}
      </div>
      <h3 className="font-semibold text-lg mb-1 truncate">{group.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{group.description || 'No description'}</p>
      <span className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs mb-3">{group.subject}</span>
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
        <span className="flex items-center gap-1"><FiUsers size={14} /> {group.memberCount || group.members?.length || 0}</span>
        <span className="flex items-center gap-1"><FiCalendar size={14} /> {group.sessionCount || 0} sessions</span>
      </div>
      <div className="mt-3 pt-3 border-t dark:border-gray-700 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          {group.createdBy?.avatar ? <img src={group.createdBy.avatar} alt="" className="w-full h-full object-cover" />
            : <span className="text-[10px] font-bold text-gray-500">{group.createdBy?.name?.charAt(0)}</span>}
        </div>
        <span className="text-xs text-gray-500">{group.createdBy?.name}</span>
      </div>
    </Link>
  );
};

export default GroupCard;

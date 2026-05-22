import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiStar } from 'react-icons/fi';

const links = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/groups', icon: FiUsers, label: 'Study Groups' },
  { to: '/scheduler', icon: FiCalendar, label: 'Schedule' },
  { to: '/mentors', icon: FiStar, label: 'Mentors' },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 z-30 transform transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 space-y-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }>
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { FiSun, FiMoon, FiBell, FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef();
  const notifRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 fixed top-0 left-0 right-0 z-40 flex items-center px-4 gap-3">
      <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden">
        <FiMenu size={20} />
      </button>
      <Link to="/dashboard" className="text-xl font-bold text-primary-600">StudyGroup</Link>
      <div className="flex-1" />
      <button onClick={toggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" title={dark ? 'Light mode' : 'Dark mode'}>
        {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
      <div className="relative" ref={notifRef}>
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative">
          <FiBell size={18} />
          {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>}
            </div>
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-sm">No notifications</p>
            ) : notifications.map(n => (
              <Link key={n._id} to={n.link || '#'} onClick={() => setShowNotifications(false)}
                className={`block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0 ${!n.isRead ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : <span className="text-sm font-bold text-primary-600">{user?.name?.charAt(0)?.toUpperCase()}</span>}
          </div>
          <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
        </button>
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700">
            <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl">
              <FiUser size={16} /> Profile
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl w-full text-left text-red-500">
              <FiLogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

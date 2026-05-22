import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupAPI, sessionAPI, notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiCalendar, FiBell, FiArrowRight, FiPlus } from 'react-icons/fi';
import GroupCard from '../components/groups/GroupCard';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ groups: 0, sessions: 0, pendingRequests: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [groupRes, notifRes] = await Promise.all([
          groupAPI.getMy(),
          notificationAPI.getAll(),
        ]);
        const groups = groupRes.data.groups;
        setMyGroups(groups);
        setStats({ groups: groups.length, sessions: 0, pendingRequests: notifRes.data.unreadCount });

        const allSessions = await Promise.all(
          groups.map(g => sessionAPI.getByGroup(g._id).catch(() => ({ data: { sessions: [] } })))
        );
        const sessions = allSessions.flatMap(s => s.data.sessions)
          .filter(s => new Date(s.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        setUpcomingSessions(sessions);
        setStats(prev => ({ ...prev, sessions: sessions.length }));
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-gray-500">Let's keep learning together.</p>
        </div>
        <Link to="/groups" className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Browse Groups
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'My Groups', value: stats.groups, icon: FiUsers, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' },
          { label: 'Upcoming', value: stats.sessions, icon: FiCalendar, color: 'bg-green-50 dark:bg-green-900/30 text-green-600' },
          { label: 'Notifications', value: stats.pendingRequests, icon: FiBell, color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600' },
          { label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1), icon: FiUsers, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            <Link to="/groups" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <FiArrowRight size={14} /></Link>
          </div>
          {myGroups.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {myGroups.slice(0, 4).map(g => <GroupCard key={g._id} group={g} />)}
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-500">
              <p>You haven't joined any groups yet.</p>
              <Link to="/groups" className="text-primary-600 hover:underline text-sm mt-2 inline-block">Browse study groups</Link>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
            <Link to="/scheduler" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <FiArrowRight size={14} /></Link>
          </div>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map(s => (
                <Link key={s._id} to={`/groups/${s.group}`} className="card flex items-center gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <FiCalendar size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.title}</p>
                    <p className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-500">
              <p>No upcoming sessions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

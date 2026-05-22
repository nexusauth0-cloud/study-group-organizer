import React, { useState, useEffect } from 'react';
import { groupAPI, sessionAPI } from '../services/api';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { FiCalendar } from 'react-icons/fi';

const Scheduler = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { groups } } = await groupAPI.getMy();
        const allSessions = await Promise.all(
          groups.map(g => sessionAPI.getByGroup(g._id).then(res => res.data.sessions.map(s => ({ ...s, groupName: g.name, groupId: g._id }))).catch(() => []))
        );
        setSessions(allSessions.flat());
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loading />;

  const upcoming = sessions.filter(s => new Date(s.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = sessions.filter(s => new Date(s.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-gray-500">View all your upcoming and past study sessions.</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Upcoming ({upcoming.length})</h2>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map(s => (
              <div key={s._id} className="card flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                  <FiCalendar size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' • '}{s.duration}min
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Group: {s.groupName}</p>
                </div>
                <span className="badge bg-green-100 text-green-700 text-xs">{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        ) : <EmptyState icon={FiCalendar} title="No upcoming sessions" description="Schedule your first study session from a group." />}
      </div>
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Past ({past.length})</h2>
          <div className="space-y-2 opacity-60">
            {past.map(s => (
              <div key={s._id} className="card flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <FiCalendar size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;

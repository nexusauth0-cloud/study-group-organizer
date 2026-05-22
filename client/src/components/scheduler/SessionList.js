import React from 'react';
import { sessionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiUsers, FiTrash2, FiVideo } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';

const SessionList = ({ sessions, onUpdate, groupId }) => {
  const { user } = useAuth();

  const handleRsvp = async (sessionId) => {
    try {
      await sessionAPI.rsvp(groupId, sessionId);
      if (onUpdate) onUpdate();
    } catch { /* ignore */ }
  };

  const handleDelete = async (sessionId) => {
    if (window.confirm('Delete this session?')) {
      await sessionAPI.delete(groupId, sessionId);
      if (onUpdate) onUpdate();
    }
  };

  if (!sessions?.length) {
    return <EmptyState icon={FiCalendar} title="No sessions scheduled" description="Schedule your first study session." />;
  }

  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-3">
      {sorted.map(session => {
        const date = new Date(session.date);
        const isPast = date < new Date();
        const isAttending = session.attendees?.some(a => a._id === user?._id || a === user?._id);
        const isCreator = session.createdBy?._id === user?._id || session.createdBy === user?._id;
        return (
          <div key={session._id} className={`card ${isPast ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{session.title}</h4>
                  {session.isRecurring && <span className="badge bg-green-100 text-green-700 text-[10px]">Recurring</span>}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><FiCalendar size={14} /> {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><FiClock size={14} /> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration}min</span>
                  <span className="flex items-center gap-1"><FiUsers size={14} /> {session.attendees?.length || 0} attending</span>
                </div>
                {session.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{session.description}</p>}
                {session.meetingLink && (
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary-600 mt-2 hover:underline">
                    <FiVideo size={14} /> Join Meeting
                  </a>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!isPast && (
                  <button onClick={() => handleRsvp(session._id)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isAttending ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    }`}>
                    {isAttending ? 'Cancel' : 'Attend'}
                  </button>
                )}
                {isCreator && (
                  <button onClick={() => handleDelete(session._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionList;

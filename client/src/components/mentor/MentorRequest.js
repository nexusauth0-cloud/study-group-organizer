import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../../services/api';
import { FiCheck, FiX, FiStar } from 'react-icons/fi';

const MentorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [tab, setTab] = useState('received');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [rec, sent] = await Promise.all([
        mentorAPI.getRequestsForMe(),
        mentorAPI.getMyRequests(),
      ]);
      setRequests(rec.data.requests);
      setMyRequests(sent.data.requests);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleRespond = async (id, status) => {
    await mentorAPI.respond(id, { status });
    loadAll();
  };

  const handleRate = async (id, rating) => {
    await mentorAPI.rate(id, { rating });
    loadAll();
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  const activeList = tab === 'received' ? requests : myRequests;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setTab('received')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'received' ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
          Received ({requests.length})
        </button>
        <button onClick={() => setTab('sent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'sent' ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
          Sent ({myRequests.length})
        </button>
      </div>
      {activeList.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No mentorship requests.</p>
      ) : activeList.map(r => {
        const otherUser = tab === 'received' ? r.student : r.mentor;
        return (
          <div key={r._id} className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-sm">{otherUser?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{otherUser?.name}</p>
                <p className="text-xs text-gray-500">{r.subject}</p>
              </div>
              <span className={`badge text-xs ${
                r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                r.status === 'accepted' ? 'bg-green-100 text-green-700' :
                r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>{r.status}</span>
            </div>
            {r.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.message}</p>}
            <div className="flex gap-2 mt-3">
              {tab === 'received' && r.status === 'pending' && (
                <>
                  <button onClick={() => handleRespond(r._id, 'accepted')} className="btn-primary text-xs py-1.5 flex items-center gap-1"><FiCheck size={14} /> Accept</button>
                  <button onClick={() => handleRespond(r._id, 'rejected')} className="btn-secondary text-xs py-1.5 flex items-center gap-1"><FiX size={14} /> Decline</button>
                </>
              )}
              {tab === 'sent' && r.status === 'accepted' && !r.rating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => handleRate(r._id, star)} className="text-gray-300 hover:text-yellow-500">
                      <FiStar size={18} fill={star <= r.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MentorRequests;

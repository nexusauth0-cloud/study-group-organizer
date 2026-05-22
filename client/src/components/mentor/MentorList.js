import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../../services/api';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import Loading from '../common/Loading';
import { FiStar, FiSend, FiSearch } from 'react-icons/fi';

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [requestModal, setRequestModal] = useState(null);
  const [requestForm, setRequestForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => { loadMentors(); }, []);

  const loadMentors = async (q) => {
    setLoading(true);
    try {
      const { data } = await mentorAPI.getAll({ search: q });
      setMentors(data.mentors);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadMentors(search);
  };

  const handleSendRequest = async (mentorId) => {
    setSending(true);
    try {
      await mentorAPI.sendRequest({ mentorId, ...requestForm });
      setRequestModal(null);
      setRequestForm({ subject: '', message: '' });
    } catch { /* ignore */ } finally { setSending(false); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search mentors by name or subject..." className="input-field pl-10 py-3" />
      </form>
      {loading ? <Loading /> : !mentors?.length ? (
        <EmptyState icon={FiStar} title="No mentors found" description="Mentors are experienced students and tutors ready to help." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map(mentor => (
            <div key={mentor._id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {mentor.avatar ? <img src={mentor.avatar} alt="" className="w-full h-full object-cover" />
                    : <span className="text-lg font-bold text-primary-600">{mentor.name?.charAt(0)}</span>}
                </div>
                <div>
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-xs text-gray-500">{mentor.school}</p>
                  <div className="flex items-center gap-1 text-yellow-500 mt-0.5">
                    <FiStar size={12} fill="currentColor" />
                    <span className="text-xs">{mentor.rating?.toFixed(1) || '0.0'} ({mentor.ratingCount || 0})</span>
                  </div>
                </div>
              </div>
              {mentor.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{mentor.bio}</p>}
              <div className="flex flex-wrap gap-1 mb-3">
                {mentor.subjects?.map((s, i) => (
                  <span key={i} className="badge bg-gray-100 dark:bg-gray-700 text-xs">{s}</span>
                ))}
              </div>
              <button onClick={() => setRequestModal(mentor)} className="btn-primary w-full text-sm flex items-center justify-center gap-1">
                <FiSend size={14} /> Request Mentorship
              </button>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={!!requestModal} onClose={() => setRequestModal(null)} title={`Request Mentorship - ${requestModal?.name || ''}`}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendRequest(requestModal._id); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <input type="text" value={requestForm.subject} onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
              className="input-field" placeholder="e.g. Mathematics" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea value={requestForm.message} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
              className="input-field" rows={3} placeholder="Why do you want this mentor?" />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full">
            {sending ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MentorList;

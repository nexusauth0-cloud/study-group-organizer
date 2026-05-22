import React, { useState } from 'react';
import { sessionAPI } from '../../services/api';

const SessionScheduler = ({ groupId, onCreated }) => {
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', duration: 60,
    isRecurring: false, recurringPattern: 'weekly', meetingLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      await sessionAPI.create(groupId, {
        title: form.title, description: form.description, date: dateTime.toISOString(),
        duration: Number(form.duration), isRecurring: form.isRecurring,
        recurringPattern: form.isRecurring ? form.recurringPattern : '',
        meetingLink: form.meetingLink,
      });
      setForm({ title: '', description: '', date: '', time: '', duration: 60, isRecurring: false, recurringPattern: 'weekly', meetingLink: '' });
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Session Title *</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time *</label>
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
        <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field">
          <option value={15}>15 min</option>
          <option value={30}>30 min</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Meeting Link (optional)</label>
        <input type="url" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} className="input-field" placeholder="https://meet.example.com/..." />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} className="rounded" />
        <span className="text-sm">Recurring session</span>
      </label>
      {form.isRecurring && (
        <select value={form.recurringPattern} onChange={(e) => setForm({ ...form, recurringPattern: e.target.value })} className="input-field">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? 'Scheduling...' : 'Schedule Session'}
      </button>
    </form>
  );
};

export default SessionScheduler;

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { groupAPI } from '../../services/api';
import { FiPlus } from 'react-icons/fi';

const CreateGroup = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', subject: '', rules: '', maxMembers: 50, isPrivate: false, tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await groupAPI.create({
        ...form, maxMembers: Number(form.maxMembers),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setOpen(false);
      setForm({ name: '', description: '', subject: '', rules: '', maxMembers: 50, isPrivate: false, tags: '' });
      if (onCreated) onCreated(data.group);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <FiPlus size={16} /> Create Group
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Create Study Group" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Group Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="e.g. Mathematics" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Members</label>
              <input type="number" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: e.target.value })} className="input-field" min={2} max={200} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rules</label>
            <textarea value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} className="input-field" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="calculus, math, advanced" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPrivate} onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })} className="rounded" />
            <span className="text-sm">Private group (invite only)</span>
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default CreateGroup;

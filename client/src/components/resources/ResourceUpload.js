import React, { useState } from 'react';
import { resourceAPI } from '../../services/api';

const ResourceUpload = ({ groupId, onUploaded }) => {
  const [form, setForm] = useState({ title: '', description: '', category: 'notes', tags: '', content: '', isCollaborative: false });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      fd.append('isCollaborative', form.isCollaborative);
      fd.append('content', form.content);
      if (file) fd.append('file', file);
      await resourceAPI.upload(groupId, fd);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="notes">Notes</option>
            <option value="assignment">Assignment</option>
            <option value="reference">Reference</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="comma,separated" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">File</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="input-field" />
        <p className="text-xs text-gray-500 mt-1">Max 10MB. Supports PDF, DOC, images, etc.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Or write content directly</label>
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field" rows={4} placeholder="Paste or type content here..." />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.isCollaborative} onChange={(e) => setForm({ ...form, isCollaborative: e.target.checked })} className="rounded" />
        <span className="text-sm">Collaborative editing</span>
      </label>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? 'Uploading...' : 'Upload Resource'}
      </button>
    </form>
  );
};

export default ResourceUpload;

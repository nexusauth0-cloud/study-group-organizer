import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiCamera, FiSave, FiAward, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import Modal from '../common/Modal';

const Profile = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', school: user?.school || '', bio: user?.bio || '', subjects: user?.subjects?.join(', ') || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('school', form.school);
      fd.append('bio', form.bio);
      fd.append('subjects', form.subjects.split(',').map(s => s.trim()).filter(Boolean));
      if (avatarFile) fd.append('avatar', avatarFile);
      await updateProfile(fd);
      setEditing(false);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const becomeMentor = async () => {
    try {
      await authAPI.becomeMentor();
      window.location.reload();
    } catch { /* ignore */ }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden mx-auto">
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" />
              : <span className="text-3xl font-bold text-primary-600">{user?.name?.charAt(0)?.toUpperCase()}</span>}
          </div>
          <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full shadow">
            <FiCamera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>
        <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
        <span className={`badge mt-2 ${user?.role === 'mentor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </span>
        {user?.school && <p className="text-gray-500 mt-2">{user.school}</p>}
        {user?.subjects?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {user.subjects.map((s, i) => <span key={i} className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{s}</span>)}
          </div>
        )}
        <button onClick={() => setEditing(true)} className="btn-primary mt-4">Edit Profile</button>
        {user?.role === 'student' && (
          <button onClick={becomeMentor} className="btn-secondary ml-2 mt-4">
            <FiAward className="inline mr-1" size={14} /> Become a Mentor
          </button>
        )}
      </div>

      <div className="card text-center border-red-200 dark:border-red-900">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        <p className="text-sm text-gray-500 mt-1">Permanently delete your account and all associated data</p>
        <button onClick={() => setShowDeleteConfirm(true)} className="btn bg-red-600 text-white hover:bg-red-700 mt-4">
          <FiTrash2 className="inline mr-1" size={14} /> Delete Account
        </button>
      </div>

      <Modal isOpen={showDeleteConfirm} onClose={() => !deleting && setShowDeleteConfirm(false)} title="Delete Account" size="sm">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure? This will permanently delete your account, remove you from all groups, and cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDeleteAccount} disabled={deleting} className="btn bg-red-600 text-white hover:bg-red-700 flex-1">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">School/College</label>
            <input type="text" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subjects (comma separated)</label>
            <input type="text" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} className="input-field" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            <FiSave className="inline mr-1" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiBook } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student', school: '', subjects: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({
        name: form.name, email: form.email, password: form.password,
        role: form.role, school: form.school,
        subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">StudyGroup</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>
        <div className="card">
          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-10" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10" placeholder="••••••••" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="input-field pl-10" placeholder="••••••••" required />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School/College</label>
              <input type="text" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="input-field" placeholder="Your institution" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subjects (comma separated)</label>
              <div className="relative">
                <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                  className="input-field pl-10" placeholder="Math, Physics, CS" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI, sessionAPI, resourceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import ChatWindow from '../chat/ChatWindow';
import SessionList from '../scheduler/SessionList';
import SessionScheduler from '../scheduler/SessionScheduler';
import ResourceList from '../resources/ResourceList';
import ResourceUpload from '../resources/ResourceUpload';
import {
  FiMessageSquare, FiCalendar, FiBookOpen, FiInfo, FiUsers, FiUserPlus, FiLogOut,
} from 'react-icons/fi';

const TABS = [
  { key: 'chat', label: 'Chat', icon: FiMessageSquare },
  { key: 'sessions', label: 'Sessions', icon: FiCalendar },
  { key: 'resources', label: 'Resources', icon: FiBookOpen },
  { key: 'about', label: 'About', icon: FiInfo },
];

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinGroupRoom, leaveGroupRoom } = useSocket();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [sessions, setSessions] = useState([]);
  const [resources, setResources] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const isMember = group?.members?.some(m => m._id === user?._id || m === user?._id);
  const isModerator = group?.moderators?.some(m => m._id === user?._id || m === user?._id);

  const loadGroup = useCallback(async () => {
    try {
      const { data } = await groupAPI.getById(id);
      setGroup(data.group);
      if (data.group.members.some(m => m._id === user?._id || m === user?._id)) {
        joinGroupRoom(id);
      }
    } catch { navigate('/groups'); } finally { setLoading(false); }
  }, [id, user?._id, navigate, joinGroupRoom]);

  const loadSessions = useCallback(async () => {
    try {
      const { data } = await sessionAPI.getByGroup(id);
      setSessions(data.sessions);
    } catch { /* ignore */ }
  }, [id]);

  const loadResources = useCallback(async () => {
    try {
      const { data } = await resourceAPI.getByGroup(id);
      setResources(data.resources);
    } catch { /* ignore */ }
  }, [id]);

  useEffect(() => { loadGroup(); }, [loadGroup]);
  useEffect(() => { if (activeTab === 'sessions') loadSessions(); }, [activeTab, id, loadSessions]);
  useEffect(() => { if (activeTab === 'resources') loadResources(); }, [activeTab, id, loadResources]);

  const handleJoin = async () => {
    try {
      await groupAPI.join(id);
      await loadGroup();
    } catch { /* ignore */ }
  };

  const handleLeave = async () => {
    if (window.confirm('Leave this group?')) {
      await groupAPI.leave(id);
      leaveGroupRoom(id);
      navigate('/groups');
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!group) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary-600">{group.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-600">{group.subject}</span>
                <span className="flex items-center gap-1"><FiUsers size={14} /> {group.members?.length || 0} members</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isMember ? (
              <>
                {isModerator && <button onClick={() => setShowSchedule(true)} className="btn-secondary text-sm"><FiCalendar className="inline mr-1" /> Schedule</button>}
                <button onClick={handleLeave} className="btn-danger text-sm"><FiLogOut className="inline mr-1" /> Leave</button>
              </>
            ) : (
              <button onClick={handleJoin} className="btn-primary text-sm"><FiUserPlus className="inline mr-1" /> Join Group</button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && isMember && <ChatWindow groupId={id} />}
      {activeTab === 'chat' && !isMember && <div className="card text-center py-12 text-gray-500">Join the group to access chat.</div>}

      {activeTab === 'sessions' && (
        <>
          {isMember && <div className="mb-4"><button onClick={() => setShowSchedule(true)} className="btn-primary text-sm"><FiCalendar className="inline mr-1" /> Schedule Session</button></div>}
          <SessionList sessions={sessions} onUpdate={loadSessions} groupId={id} />
        </>
      )}

      {activeTab === 'resources' && (
        <>
          {isMember && <div className="mb-4"><button onClick={() => setShowUpload(true)} className="btn-primary text-sm"><FiBookOpen className="inline mr-1" /> Upload Resource</button></div>}
          <ResourceList resources={resources} onUpdate={loadResources} groupId={id} />
        </>
      )}

      {activeTab === 'about' && (
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-600 dark:text-gray-400">{group.description || 'No description provided.'}</p>
          </div>
          {group.rules && (
            <div>
              <h3 className="font-semibold mb-1">Rules</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{group.rules}</p>
            </div>
          )}
          {group.tags?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((t, i) => <span key={i} className="badge bg-gray-100 dark:bg-gray-700">{t}</span>)}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-2">Members ({group.members?.length})</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.members?.map(m => (
                <div key={m._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold">{m.name?.charAt(0)}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.role} {m.subjects?.length ? `• ${m.subjects.join(', ')}` : ''}</p>
                  </div>
                  {group.moderators?.some(mod => mod._id === m._id || mod === m._id) && (
                    <span className="badge bg-yellow-100 text-yellow-700 text-xs ml-auto">Mod</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule Session" size="lg">
        <SessionScheduler groupId={id} onCreated={() => { setShowSchedule(false); loadSessions(); }} />
      </Modal>
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Resource" size="lg">
        <ResourceUpload groupId={id} onUploaded={() => { setShowUpload(false); loadResources(); }} />
      </Modal>
    </div>
  );
};

export default GroupDetail;

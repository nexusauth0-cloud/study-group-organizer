import React, { useState, useEffect, useRef, useCallback } from 'react';
import { messageAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useSocket } from '../../context/SocketContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { FiVideo } from 'react-icons/fi';
import VideoCall from '../video/VideoCall';

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [inCall, setInCall] = useState(false);
  const { typingUsers } = useSocket();
  const typingRef = useRef();

  const socket = getSocket();

  const loadMessages = useCallback(async (p = page, reset = false) => {
    try {
      const { data } = await messageAPI.getByGroup(groupId, { page: p, limit: 50 });
      if (reset) {
        setMessages(data.messages);
      } else {
        setMessages(prev => [...data.messages, ...prev]);
      }
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [groupId, page]);

  useEffect(() => {
    setMessages([]);
    setPage(1);
    loadMessages(1, true);
  }, [loadMessages]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      setMessages(prev => [...prev, msg]);
    };
    socket.on('new_message', handler);
    return () => socket.off('new_message', handler);
  }, [socket]);

  const handleSend = async (formData) => {
    formData.append('groupId', groupId);
    try {
      await messageAPI.send(groupId, formData);
      await messageAPI.markRead(groupId);
    } catch { /* ignore */ }
  };

  const handleTyping = () => {
    socket?.emit('typing', { groupId });
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => {
      socket?.emit('stop_typing', { groupId });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingRef.current);
      socket?.emit('stop_typing', { groupId });
    };
  }, [groupId, socket]);

  const typingText = Object.keys(typingUsers).length > 0
    ? `${Object.values(typingUsers).join(', ')} typing...`
    : '';

  return (
    <div className="card flex flex-col h-[60vh] sm:h-[65vh] overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <h3 className="font-semibold">Group Chat</h3>
        <button onClick={() => setInCall(!inCall)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-primary-600">
          <FiVideo size={18} />
        </button>
      </div>
      {inCall && (
        <VideoCall groupId={groupId} onEnd={() => setInCall(false)} />
      )}
      <MessageList messages={messages} loading={loading} />
      {typingText && <p className="text-xs text-gray-500 px-4 pb-1 italic">{typingText}</p>}
      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
};

export default ChatWindow;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket, joinGroupRoom, leaveGroupRoom } from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTyping = ({ userId, name }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: name }));
      setTimeout(() => {
        setTypingUsers(prev => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }, 3000);
    };

    const handleStopTyping = ({ userId }) => {
      setTypingUsers(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ typingUsers, joinGroupRoom, leaveGroupRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

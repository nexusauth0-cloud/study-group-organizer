import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinGroupRoom = (groupId) => {
  if (socket?.connected) socket.emit('join_group', groupId);
};

export const leaveGroupRoom = (groupId) => {
  if (socket?.connected) socket.emit('leave_group', groupId);
};

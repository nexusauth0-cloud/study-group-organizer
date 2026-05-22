const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

const connectedUsers = new Map();

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    connectedUsers.set(socket.userId, socket.id);
    console.log(`User connected: ${socket.user.name}`);

    socket.on('join_group', (groupId) => {
      socket.join(`group:${groupId}`);
    });

    socket.on('leave_group', (groupId) => {
      socket.leave(`group:${groupId}`);
    });

    socket.on('typing', ({ groupId }) => {
      socket.to(`group:${groupId}`).emit('user_typing', {
        userId: socket.userId, name: socket.user.name,
      });
    });

    socket.on('stop_typing', ({ groupId }) => {
      socket.to(`group:${groupId}`).emit('user_stop_typing', {
        userId: socket.userId,
      });
    });

    socket.on('video_offer', ({ to, offer }) => {
      const targetSocket = connectedUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('video_offer', { from: socket.userId, offer, userName: socket.user.name });
      }
    });

    socket.on('video_answer', ({ to, answer }) => {
      const targetSocket = connectedUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('video_answer', { from: socket.userId, answer });
      }
    });

    socket.on('ice_candidate', ({ to, candidate }) => {
      const targetSocket = connectedUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('ice_candidate', { from: socket.userId, candidate });
      }
    });

    socket.on('end_call', ({ to }) => {
      const targetSocket = connectedUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('call_ended', { from: socket.userId });
      }
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.userId);
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = setupSocket;

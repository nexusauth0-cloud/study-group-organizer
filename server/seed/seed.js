const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Group = require('../models/Group');
const Session = require('../models/Session');
const Resource = require('../models/Resource');
const Message = require('../models/Message');
const { MONGO_URI } = require('../config/env');

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Group.deleteMany({}), Session.deleteMany({}),
    Resource.deleteMany({}), Message.deleteMany({}),
  ]);

  console.log('Creating users...');
  const users = await User.create([
    { name: 'Alice Mentor', email: 'alice@example.com', password: 'password123', role: 'mentor', isMentor: true, subjects: ['Mathematics', 'Physics'], school: 'MIT', bio: 'Experienced math tutor with 5 years' },
    { name: 'Bob Student', email: 'bob@example.com', password: 'password123', role: 'student', subjects: ['Mathematics'], school: 'State University' },
    { name: 'Charlie Mentor', email: 'charlie@example.com', password: 'password123', role: 'mentor', isMentor: true, subjects: ['Computer Science', 'Programming'], school: 'Stanford', bio: 'Full-stack developer and mentor' },
    { name: 'Diana Student', email: 'diana@example.com', password: 'password123', role: 'student', subjects: ['Physics', 'Chemistry'], school: 'City College' },
    { name: 'Eve Student', email: 'eve@example.com', password: 'password123', role: 'student', subjects: ['Biology', 'Chemistry'], school: 'University of Science' },
  ]);

  console.log('Creating groups...');
  const groups = await Group.create([
    { name: 'Calculus Study Group', description: 'Group for calculus enthusiasts. We cover derivatives, integrals, and multivariable calculus.', subject: 'Mathematics', rules: 'Be respectful. No spam. Attend at least 1 session per week.', createdBy: users[0]._id, members: [users[0]._id, users[1]._id, users[3]._id], moderators: [users[0]._id], tags: ['calculus', 'math', 'advanced'], memberCount: 3 },
    { name: 'Web Dev Bootcamp', description: 'Learn full-stack web development together. React, Node.js, MongoDB.', subject: 'Computer Science', rules: 'Complete weekly assignments. Help fellow members.', createdBy: users[2]._id, members: [users[2]._id, users[1]._id, users[4]._id], moderators: [users[2]._id], tags: ['webdev', 'react', 'nodejs'], memberCount: 3 },
    { name: 'Physics Lab Partners', description: 'Group for physics students to discuss experiments and theory.', subject: 'Physics', rules: 'Bring your lab manual. Share resources.', createdBy: users[0]._id, members: [users[0]._id, users[3]._id, users[4]._id], moderators: [users[0]._id], tags: ['physics', 'lab', 'science'], memberCount: 3 },
  ]);

  console.log('Creating sessions...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  await Session.create([
    { group: groups[0]._id, title: 'Derivatives Review', description: 'Review of derivative rules and applications', date: tomorrow, duration: 60, createdBy: users[0]._id, attendees: [users[0]._id, users[1]._id], meetingLink: 'https://meet.example.com/calc1' },
    { group: groups[1]._id, title: 'React Hooks Deep Dive', description: 'Understanding useState, useEffect, useContext', date: nextWeek, duration: 90, createdBy: users[2]._id, attendees: [users[2]._id, users[1]._id], meetingLink: 'https://meet.example.com/react1' },
    { group: groups[2]._id, title: 'Lab: Pendulum Experiment', description: 'Analyze pendulum motion and calculate g', date: tomorrow, duration: 120, createdBy: users[0]._id, attendees: [users[0]._id, users[3]._id], meetingLink: '' },
  ]);

  console.log('Creating resources...');
  await Resource.create([
    { group: groups[0]._id, title: 'Derivative Cheat Sheet', description: 'Quick reference for derivative rules', uploadedBy: users[0]._id, fileType: 'application/pdf', category: 'notes', tags: ['derivatives', 'cheatsheet'], content: 'Derivative rules: d/dx(x^n) = nx^(n-1)' },
    { group: groups[1]._id, title: 'React Project Setup Guide', description: 'Step by step guide to set up a React project', uploadedBy: users[2]._id, fileType: 'text/plain', category: 'reference', tags: ['react', 'setup'], content: 'npx create-react-app my-app\ncd my-app\nnpm start' },
    { group: groups[2]._id, title: 'Lab Report Template', description: 'Template for physics lab reports', uploadedBy: users[0]._id, fileType: 'application/pdf', category: 'assignment', tags: ['lab', 'template'], content: 'Title, Objective, Procedure, Results, Conclusion' },
  ]);

  console.log('Creating messages...');
  await Message.create([
    { group: groups[0]._id, sender: users[0]._id, content: 'Welcome to the Calculus Study Group! 🎉', messageType: 'text', readBy: [users[0]._id] },
    { group: groups[0]._id, sender: users[1]._id, content: 'Thanks! Excited to learn calculus together.', messageType: 'text', readBy: [users[0]._id, users[1]._id] },
    { group: groups[1]._id, sender: users[2]._id, content: 'Hi everyone! Ready to build some awesome web apps?', messageType: 'text', readBy: [users[2]._id] },
    { group: groups[2]._id, sender: users[3]._id, content: 'Hello! Anyone else working on the pendulum lab?', messageType: 'text', readBy: [users[3]._id] },
  ]);

  console.log('Seed completed successfully!');
  console.log('---');
  console.log('Test accounts:');
  users.forEach(u => console.log(`  ${u.name}: ${u.email} / password123`));
  console.log('---');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

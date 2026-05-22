const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, subjects, school } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role: role || 'student', subjects: subjects || [], school: school || '' });
    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) { next(error); }
};

exports.oauthLogin = async (req, res, next) => {
  try {
    const { name, email, provider, providerId, avatar } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      user.oauthProvider = provider;
      user.oauthId = providerId;
      if (avatar) user.avatar = avatar;
      await user.save();
    } else {
      user = await User.create({
        name, email, password: providerId + Date.now(),
        oauthProvider: provider, oauthId: providerId, avatar: avatar || '',
      });
    }
    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'avatar', 'subjects', 'school', 'bio'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ user });
  } catch (error) { next(error); }
};

exports.becomeMentor = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { role: 'mentor', isMentor: true }, { new: true });
    res.json({ user });
  } catch (error) { next(error); }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const Group = require('../models/Group');
    const Notification = require('../models/Notification');
    const MentorRequest = require('../models/MentorRequest');
    await Promise.all([
      User.findByIdAndDelete(userId),
      Group.updateMany({ members: userId }, { $pull: { members: userId, moderators: userId } }),
      Notification.deleteMany({ user: userId }),
      MentorRequest.deleteMany({ $or: [{ student: userId }, { mentor: userId }] }),
    ]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) { next(error); }
};

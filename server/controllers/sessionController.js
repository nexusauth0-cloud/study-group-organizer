const Session = require('../models/Session');
const Group = require('../models/Group');
const Notification = require('../models/Notification');

exports.getGroupSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ group: req.params.groupId })
      .populate('createdBy', 'name avatar')
      .populate('attendees', 'name avatar')
      .sort({ date: 1 });
    res.json({ sessions });
  } catch (error) { next(error); }
};

exports.createSession = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a group member' });
    }
    const { title, description, date, duration, isRecurring, recurringPattern, meetingLink } = req.body;
    const session = await Session.create({
      group: req.params.groupId, title, description, date, duration, isRecurring,
      recurringPattern: isRecurring ? recurringPattern : '', meetingLink,
      createdBy: req.user._id, attendees: [req.user._id],
    });
    group.sessionCount += 1;
    await group.save();
    const groupPopulated = await Group.findById(group._id).populate('members', 'name');
    for (const member of groupPopulated.members) {
      if (member._id.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: member._id, type: 'session_reminder',
          title: 'New study session', message: `New session "${title}" in ${group.name}`,
          link: `/groups/${group._id}`,
        });
      }
    }
    res.status(201).json({ session });
  } catch (error) { next(error); }
};

exports.rsvpSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    const index = session.attendees.indexOf(req.user._id);
    if (index > -1) {
      session.attendees.splice(index, 1);
    } else {
      session.attendees.push(req.user._id);
    }
    await session.save();
    res.json({ session, attending: index === -1 });
  } catch (error) { next(error); }
};

exports.updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const allowedFields = ['title', 'description', 'date', 'duration', 'meetingLink', 'status'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) session[field] = req.body[field];
    });
    await session.save();
    res.json({ session });
  } catch (error) { next(error); }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Session.findByIdAndDelete(req.params.id);
    await Group.findByIdAndUpdate(session.group, { $inc: { sessionCount: -1 } });
    res.json({ message: 'Session cancelled' });
  } catch (error) { next(error); }
};

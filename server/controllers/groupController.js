const Group = require('../models/Group');
const Notification = require('../models/Notification');

exports.getGroups = async (req, res, next) => {
  try {
    const { search, subject, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    const total = await Group.countDocuments(query);
    const groups = await Group.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ groups, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

exports.getMyGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('createdBy', 'name avatar')
      .sort({ updatedAt: -1 });
    res.json({ groups });
  } catch (error) { next(error); }
};

exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('members', 'name avatar role subjects')
      .populate('moderators', 'name avatar');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json({ group });
  } catch (error) { next(error); }
};

exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, subject, rules, maxMembers, isPrivate, tags } = req.body;
    const group = await Group.create({
      name, description, subject, rules, maxMembers, isPrivate, tags: tags || [],
      createdBy: req.user._id,
      members: [req.user._id],
      moderators: [req.user._id],
    });
    res.status(201).json({ group });
  } catch (error) { next(error); }
};

exports.joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }
    group.members.push(req.user._id);
    group.memberCount = group.members.length;
    await group.save();
    await Notification.create({
      user: group.createdBy,
      type: 'group_joined',
      title: 'New member joined',
      message: `${req.user.name} joined ${group.name}`,
      link: `/groups/${group._id}`,
    });
    res.json({ group });
  } catch (error) { next(error); }
};

exports.leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
    group.moderators = group.moderators.filter(m => m.toString() !== req.user._id.toString());
    group.memberCount = group.members.length;
    await group.save();
    res.json({ message: 'Left group successfully' });
  } catch (error) { next(error); }
};

exports.updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.moderators.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to edit this group' });
    }
    const allowedFields = ['name', 'description', 'subject', 'rules', 'maxMembers', 'isPrivate', 'tags', 'coverImage'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) group[field] = req.body[field];
    });
    await group.save();
    res.json({ group });
  } catch (error) { next(error); }
};

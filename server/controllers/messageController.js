const Message = require('../models/Message');
const Group = require('../models/Group');
const Notification = require('../models/Notification');

exports.getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const total = await Message.countDocuments({ group: req.params.groupId });
    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ messages: messages.reverse(), total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group || !group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a group member' });
    }
    const { content, messageType } = req.body;
    const messageData = {
      group: req.params.groupId, sender: req.user._id,
      content: content || '', messageType: messageType || 'text',
      readBy: [req.user._id],
    };
    if (req.file) {
      messageData.fileUrl = `/uploads/${req.file.filename}`;
      messageData.messageType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';
    }
    const message = await Message.create(messageData);
    const populated = await Message.findById(message._id).populate('sender', 'name avatar');
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${req.params.groupId}`).emit('new_message', populated);
    }
    res.status(201).json({ message: populated });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      { group: req.params.groupId, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );
    res.json({ success: true });
  } catch (error) { next(error); }
};

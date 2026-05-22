const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Group name is required'], trim: true, maxlength: 100 },
  description: { type: String, maxlength: 2000, default: '' },
  subject: { type: String, required: [true, 'Subject is required'], trim: true },
  rules: { type: String, maxlength: 2000, default: '' },
  coverImage: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxMembers: { type: Number, default: 50 },
  isPrivate: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],
  sessionCount: { type: Number, default: 0 },
  memberCount: { type: Number, default: 1 },
}, { timestamps: true });

groupSchema.index({ subject: 1, name: 'text', description: 'text' });

module.exports = mongoose.model('Group', groupSchema);

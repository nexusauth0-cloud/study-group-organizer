const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  title: { type: String, required: [true, 'Session title is required'], trim: true, maxlength: 200 },
  description: { type: String, maxlength: 1000, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: [true, 'Session date is required'] },
  duration: { type: Number, default: 60, min: 15, max: 480 },
  isRecurring: { type: Boolean, default: false },
  recurringPattern: { type: String, enum: ['', 'daily', 'weekly', 'biweekly', 'monthly'], default: '' },
  meetingLink: { type: String, default: '' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
}, { timestamps: true });

sessionSchema.index({ group: 1, date: -1 });

module.exports = mongoose.model('Session', sessionSchema);

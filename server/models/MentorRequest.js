const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, maxlength: 500, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  feedback: { type: String, maxlength: 500, default: '' },
}, { timestamps: true });

mentorRequestSchema.index({ student: 1, mentor: 1 });

module.exports = mongoose.model('MentorRequest', mentorRequestSchema);

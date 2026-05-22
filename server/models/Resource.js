const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  title: { type: String, required: [true, 'Resource title is required'], trim: true },
  description: { type: String, maxlength: 500, default: '' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, default: '' },
  fileType: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  category: { type: String, enum: ['notes', 'assignment', 'reference', 'other'], default: 'notes' },
  tags: [{ type: String, trim: true }],
  isCollaborative: { type: Boolean, default: false },
  content: { type: String, default: '' },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

resourceSchema.index({ group: 1, category: 1 });

module.exports = mongoose.model('Resource', resourceSchema);

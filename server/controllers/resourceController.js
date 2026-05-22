const Resource = require('../models/Resource');
const Group = require('../models/Group');
const Notification = require('../models/Notification');

exports.getResources = async (req, res, next) => {
  try {
    const { category, tag } = req.query;
    const query = { group: req.params.groupId };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ resources });
  } catch (error) { next(error); }
};

exports.uploadResource = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a group member' });
    }
    const { title, description, category, tags, content, isCollaborative } = req.body;
    const resourceData = {
      group: req.params.groupId, title, description, category: category || 'notes',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      isCollaborative: isCollaborative || false, content: content || '',
      uploadedBy: req.user._id,
    };
    if (req.file) {
      resourceData.fileUrl = `/uploads/${req.file.filename}`;
      resourceData.fileType = req.file.mimetype;
      resourceData.fileSize = req.file.size;
    }
    const resource = await Resource.create(resourceData);
    const groupPopulated = await Group.findById(group._id).populate('members', 'name');
    for (const member of groupPopulated.members) {
      if (member._id.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: member._id, type: 'resource_uploaded',
          title: 'New resource', message: `${title} uploaded in ${group.name}`,
          link: `/groups/${group._id}/resources`,
        });
      }
    }
    res.status(201).json({ resource });
  } catch (error) { next(error); }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    const allowedFields = ['title', 'description', 'category', 'tags', 'content'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) resource[field] = req.body[field];
    });
    await resource.save();
    res.json({ resource });
  } catch (error) { next(error); }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (error) { next(error); }
};

exports.incrementDownload = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id, { $inc: { downloads: 1 } }, { new: true }
    );
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ resource });
  } catch (error) { next(error); }
};

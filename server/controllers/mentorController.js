const MentorRequest = require('../models/MentorRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getMentors = async (req, res, next) => {
  try {
    const { subject, search } = req.query;
    const query = { role: 'mentor', isMentor: true };
    if (subject) query.subjects = { $regex: subject, $options: 'i' };
    if (search) query.name = { $regex: search, $options: 'i' };
    const mentors = await User.find(query).select('-password').sort({ rating: -1 });
    res.json({ mentors });
  } catch (error) { next(error); }
};

exports.sendMentorRequest = async (req, res, next) => {
  try {
    const { mentorId, subject, message } = req.body;
    if (req.user._id.toString() === mentorId) {
      return res.status(400).json({ message: 'Cannot request yourself' });
    }
    const existing = await MentorRequest.findOne({
      student: req.user._id, mentor: mentorId, status: { $in: ['pending', 'accepted'] },
    });
    if (existing) {
      return res.status(400).json({ message: 'Request already exists' });
    }
    const request = await MentorRequest.create({
      student: req.user._id, mentor: mentorId, subject, message,
    });
    await Notification.create({
      user: mentorId, type: 'mentor_request',
      title: 'Mentorship request', message: `${req.user.name} wants you as a mentor for ${subject}`,
      link: '/mentors',
      relatedId: request._id,
    });
    res.status(201).json({ request });
  } catch (error) { next(error); }
};

exports.getMyMentorRequests = async (req, res, next) => {
  try {
    const requests = await MentorRequest.find({ student: req.user._id })
      .populate('mentor', 'name avatar subjects rating')
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) { next(error); }
};

exports.getMentorRequestsForMe = async (req, res, next) => {
  try {
    const requests = await MentorRequest.find({ mentor: req.user._id })
      .populate('student', 'name avatar subjects school')
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) { next(error); }
};

exports.respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await MentorRequest.findById(req.params.id).populate('student', 'name');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.status = status;
    await request.save();
    if (status === 'accepted') {
      await Notification.create({
        user: request.student._id, type: 'mentor_accepted',
        title: 'Mentorship accepted', message: `${req.user.name} accepted your mentorship request`,
        link: '/mentors',
        relatedId: request._id,
      });
    }
    res.json({ request });
  } catch (error) { next(error); }
};

exports.rateMentor = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const request = await MentorRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.rating = rating;
    request.feedback = feedback || '';
    request.status = 'completed';
    await request.save();
    const mentor = await User.findById(request.mentor);
    const completedRequests = await MentorRequest.find({ mentor: request.mentor, rating: { $gt: 0 } });
    const avgRating = completedRequests.reduce((sum, r) => sum + r.rating, 0) / completedRequests.length;
    mentor.rating = Math.round(avgRating * 10) / 10;
    mentor.ratingCount = completedRequests.length;
    await mentor.save();
    res.json({ request, mentor });
  } catch (error) { next(error); }
};

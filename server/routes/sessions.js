const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const {
  getGroupSessions, createSession, rsvpSession, updateSession, deleteSession,
} = require('../controllers/sessionController');

router.get('/', protect, getGroupSessions);
router.post('/', protect, createSession);
router.put('/:id', protect, updateSession);
router.delete('/:id', protect, deleteSession);
router.post('/:id/rsvp', protect, rsvpSession);

module.exports = router;

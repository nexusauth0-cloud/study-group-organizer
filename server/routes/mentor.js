const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMentors, sendMentorRequest, getMyMentorRequests, getMentorRequestsForMe,
  respondToRequest, rateMentor,
} = require('../controllers/mentorController');

router.get('/', protect, getMentors);
router.post('/request', protect, sendMentorRequest);
router.get('/requests', protect, getMyMentorRequests);
router.get('/requests/me', protect, getMentorRequestsForMe);
router.put('/requests/:id/respond', protect, respondToRequest);
router.put('/requests/:id/rate', protect, rateMentor);

module.exports = router;

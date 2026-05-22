const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getMessages, sendMessage, markAsRead } = require('../controllers/messageController');

router.get('/', protect, getMessages);
router.post('/', protect, upload.single('file'), sendMessage);
router.post('/read', protect, markAsRead);

module.exports = router;

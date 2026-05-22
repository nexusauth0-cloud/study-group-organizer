const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getGroups, getMyGroups, getGroupById, createGroup, joinGroup, leaveGroup, updateGroup,
} = require('../controllers/groupController');

router.get('/', protect, getGroups);
router.get('/my', protect, getMyGroups);
router.get('/:id', protect, getGroupById);
router.post('/', protect, createGroup);
router.put('/:id', protect, updateGroup);
router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);

module.exports = router;

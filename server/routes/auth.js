const express = require('express');
const router = express.Router();
const { register, login, oauthLogin, getMe, updateProfile, becomeMentor, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.post('/oauth', oauthLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/become-mentor', protect, becomeMentor);
router.delete('/account', protect, deleteAccount);

module.exports = router;

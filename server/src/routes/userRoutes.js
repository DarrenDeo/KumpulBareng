const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserStats, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// URL: /api/users/register
router.post('/register', registerUser);

// URL: /api/users/login
router.post('/login', loginUser);

router.get('/stats', protect, getUserStats);
router.get('/me', protect, getMe);

module.exports = router;
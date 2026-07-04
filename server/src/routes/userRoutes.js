const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserStats,
  getMe,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/userSchema');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// POST /api/users/register — Registrasi user baru (dengan validasi Zod)
router.post('/register', validate(registerSchema), registerUser);

// POST /api/users/login — Login user (dengan validasi Zod)
router.post('/login', validate(loginSchema), loginUser);

// POST /api/users/logout — Logout (hapus HttpOnly cookie)
router.post('/logout', logoutUser);

// ============================================================
// PROTECTED ROUTES (butuh login)
// ============================================================

// GET /api/users/stats — Statistik user (event dibuat, diikuti, dll)
router.get('/stats', protect, getUserStats);

// GET /api/users/me — Profile user yang sedang login
router.get('/me', protect, getMe);

module.exports = router;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prismaClient');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/responseHelper');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '7d';
const COOKIE_EXPIRES_DAYS = 7;

/**
 * Membuat JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Set JWT sebagai HttpOnly Cookie pada response
 */
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000),
    httpOnly: true,        // Tidak bisa diakses oleh JavaScript (anti-XSS)
    secure: process.env.NODE_ENV === 'production', // HTTPS only di production
    sameSite: 'lax',       // CSRF protection
    path: '/',
  };
  res.cookie('jwt', token, cookieOptions);
};

// @desc    Register user baru
// @route   POST /api/users/register
// @access  Public
const registerUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Cek apakah email sudah terdaftar
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new AppError('Email sudah terdaftar. Silakan gunakan email lain.', 409);
  }

  // Hash password dengan bcrypt (salt rounds: 12 untuk keamanan lebih)
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Buat user baru
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  // Generate token dan set sebagai HttpOnly cookie
  const token = generateToken(user.id);
  setTokenCookie(res, token);

  sendSuccess(res, { user }, 'Registrasi berhasil! Selamat datang.', 201);
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Cari user berdasarkan email (include password untuk comparison)
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Email atau password salah.', 401);
  }

  // Bandingkan password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Email atau password salah.', 401);
  }

  // Generate token dan set cookie
  const token = generateToken(user.id);
  setTokenCookie(res, token);

  sendSuccess(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  }, 'Login berhasil!');
});

// @desc    Logout user (hapus cookie)
// @route   POST /api/users/logout
// @access  Public
const logoutUser = catchAsync(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: '/',
  });

  sendSuccess(res, null, 'Logout berhasil!');
});

// @desc    Get user stats (jumlah event dibuat, diikuti, dll)
// @route   GET /api/users/stats
// @access  Private
const getUserStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Jalankan semua query secara paralel untuk efisiensi
  const [eventsCreated, eventsJoined, totalParticipantsInMyEvents, upcomingEvents] = await Promise.all([
    // Jumlah event yang dibuat user
    prisma.event.count({ where: { authorId: userId } }),
    // Jumlah event yang diikuti user
    prisma.event.count({
      where: { participants: { some: { id: userId } } },
    }),
    // Total peserta di semua event yang dibuat user
    prisma.user.count({
      where: {
        joinedEvents: { some: { authorId: userId } },
      },
    }),
    // Jumlah event upcoming yang dibuat user
    prisma.event.count({
      where: {
        authorId: userId,
        eventDate: { gte: new Date() },
      },
    }),
  ]);

  sendSuccess(res, {
    eventsCreated,
    eventsJoined,
    totalParticipantsInMyEvents,
    upcomingEvents,
  });
});

// @desc    Get current logged-in user profile
// @route   GET /api/users/me
// @access  Private
const getMe = catchAsync(async (req, res) => {
  sendSuccess(res, { user: req.user });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserStats,
  getMe,
};

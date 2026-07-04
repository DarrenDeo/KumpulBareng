const jwt = require('jsonwebtoken');
const prisma = require('../lib/prismaClient');
const { AppError, catchAsync } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/**
 * Middleware untuk melindungi route yang membutuhkan autentikasi.
 * Mendukung token dari:
 * 1. HttpOnly Cookie (preferred, lebih aman dari XSS)
 * 2. Authorization: Bearer <token> header (backward compatible)
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Prioritas 1: Cek HttpOnly cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Prioritas 2: Cek Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Akses ditolak. Silakan login terlebih dahulu.', 401);
  }

  // Verifikasi token
  const decoded = jwt.verify(token, JWT_SECRET);

  // Ambil user dari database (tanpa password)
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User tidak ditemukan. Token tidak valid.', 401);
  }

  // Simpan user ke req.user untuk digunakan di controller
  req.user = user;
  next();
});

module.exports = { protect };

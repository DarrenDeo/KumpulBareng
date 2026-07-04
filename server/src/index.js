require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const prisma = require('./lib/prismaClient');
const { globalErrorHandler } = require('./middleware/errorHandler');

// Route imports
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const statsRoutes = require('./routes/statsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet — Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, dll)
app.use(helmet());

// CORS — Izinkan request dari frontend, termasuk cookies
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // Wajib untuk HttpOnly cookies
  })
);

// ============================================================
// RATE LIMITING
// ============================================================

// Global rate limiter: 100 requests per 15 menit per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    errors: [],
  },
});

// Auth rate limiter: 5 attempts per 15 menit per IP (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Dimatikan sementara untuk demo
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login/register. Silakan coba lagi dalam 15 menit.',
    errors: [],
  },
});

// Apply global limiter ke semua routes
app.use('/api', globalLimiter);

// Apply stricter limiter ke auth routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// ============================================================
// BODY PARSING & LOGGING
// ============================================================

// Cookie parser — untuk membaca HttpOnly JWT cookie
app.use(cookieParser());

// Body parser dengan limit 10kb (mencegah payload bomb)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const logger = require('./utils/logger');

// Request logging (morgan stream diarahkan ke winston)
const morganFormat = NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// ============================================================
// HEALTH CHECK — untuk Kubernetes probes
// ============================================================

app.get('/healthz', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      db: 'disconnected',
      message: error.message,
    });
  }
});

// ============================================================
// API ROUTES
// ============================================================

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang di KumpulBareng API! 🎉',
    version: '2.0.0',
    docs: {
      users: '/api/users',
      events: '/api/events',
      stats: '/api/stats',
      payments: '/api/payments',
      health: '/healthz',
    },
  });
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentRoutes);

// ============================================================
// 404 HANDLER — Route tidak ditemukan
// ============================================================

app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
    errors: [],
  });
});

// ============================================================
// GLOBAL ERROR HANDLER — HARUS yang terakhir
// ============================================================

app.use(globalErrorHandler);

// ============================================================
// START SERVER
// ============================================================

const server = app.listen(PORT, () => {
  logger.info(`🚀 KumpulBareng API v2.0 Started`);
  logger.info(`Environment : ${NODE_ENV}`);
  logger.info(`Port        : ${PORT}`);
  logger.info(`Client URL  : ${CLIENT_URL}`);
  logger.info(`Health Check: http://localhost:${PORT}/healthz`);
  logger.info(`API Root    : http://localhost:${PORT}/api`);
});

// Graceful shutdown — clean up database connections
const gracefulShutdown = async (signal) => {
  logger.info(`⚠️  ${signal} diterima. Menutup server...`);
  
  server.close(async () => {
    logger.info('HTTP server ditutup.');
    await prisma.$disconnect();
    logger.info('Database connection ditutup.');
    process.exit(0);
  });

  // Force exit setelah 10 detik jika tidak bisa graceful
  setTimeout(() => {
    logger.error('Force exit setelah timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

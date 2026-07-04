/**
 * Custom error class with HTTP status code support.
 * Usage: throw new AppError('Pesan error', 400);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware.
 * Catches all errors and sends a standardized JSON response.
 * Must be the LAST middleware registered in Express.
 */
const globalErrorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || res.statusCode;
  // If statusCode is still 200 (not set by controller), default to 500
  if (statusCode === 200) statusCode = 500;
  
  const message = err.message || 'Terjadi kesalahan pada server';

  // Handle specific Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.join(', ') || 'field';
    return res.status(statusCode).json({
      success: false,
      message: `Data dengan ${field} tersebut sudah ada`,
      errors: [],
    });
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    return res.status(statusCode).json({
      success: false,
      message: 'Data tidak ditemukan',
      errors: [],
    });
  }

  if (err.code === 'P2003') {
    statusCode = 409;
    return res.status(statusCode).json({
      success: false,
      message: 'Tidak dapat menghapus data karena masih memiliki relasi',
      errors: [],
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    return res.status(statusCode).json({
      success: false,
      message: 'Token tidak valid',
      errors: [],
    });
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    return res.status(statusCode).json({
      success: false,
      message: 'Token sudah kedaluwarsa, silakan login kembali',
      errors: [],
    });
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('\n🔴 Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Async handler wrapper — catches async errors and forwards to globalErrorHandler.
 * Replacement for express-async-handler with AppError support.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, globalErrorHandler, catchAsync };

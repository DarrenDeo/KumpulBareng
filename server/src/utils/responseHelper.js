/**
 * Standardized API Response Helpers
 * 
 * Semua endpoint harus menggunakan format response yang konsisten:
 * - Success: { success: true, data: {...}, message: '...' }
 * - Paginated: { success: true, data: [...], meta: { page, limit, total, totalPages } }
 * - Error responses handled by globalErrorHandler
 */

/**
 * Send a success response
 * @param {import('express').Response} res
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, message = 'Berhasil', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a paginated response
 * @param {import('express').Response} res
 * @param {Array} data - Array of items
 * @param {object} meta - Pagination metadata
 * @param {string} message - Success message
 */
const sendPaginated = (res, data, meta, message = 'Berhasil') => {
  res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  });
};

module.exports = { sendSuccess, sendPaginated };

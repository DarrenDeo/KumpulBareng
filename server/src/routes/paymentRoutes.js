const express = require('express');
const router = express.Router();
const {
  createTransaction,
  simulatePaymentSuccess,
  simulatePaymentFailure,
  getMyTransactions,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// ============================================================
// DUMMY PAYMENT ROUTES (untuk development lokal)
// Di production, ganti dengan integrasi Midtrans Snap API.
// ============================================================

// POST /api/payments/create-transaction — Buat transaksi baru (PENDING)
router.post('/create-transaction', protect, createTransaction);

// POST /api/payments/simulate-success — Simulasi pembayaran berhasil (dev only)
router.post('/simulate-success', protect, simulatePaymentSuccess);

// POST /api/payments/simulate-failure — Simulasi pembayaran gagal (dev only)
router.post('/simulate-failure', protect, simulatePaymentFailure);

// GET /api/payments/my-transactions — Daftar transaksi user
router.get('/my-transactions', protect, getMyTransactions);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createTransaction, handleNotification } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-transaction', protect, createTransaction);
router.post('/notification', handleNotification); // <-- TAMBAHKAN INI

module.exports = router;
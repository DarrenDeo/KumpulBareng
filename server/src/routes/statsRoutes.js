const express = require('express');
const router = express.Router();
const { getSiteStats } = require('../controllers/statsController');

// GET /api/stats — Statistik situs (total users, events, dll)
router.get('/', getSiteStats);

module.exports = router;
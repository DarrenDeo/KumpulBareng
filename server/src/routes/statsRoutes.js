const express = require('express');
const router = express.Router();
const { getSiteStats } = require('../controllers/statsController');

router.get('/', getSiteStats);

module.exports = router;
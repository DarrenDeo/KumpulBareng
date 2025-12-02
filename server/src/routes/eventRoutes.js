const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  joinEvent,
  leaveEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/events           → semua event (public)
router.get('/', getEvents);

// POST /api/events          → buat event baru (butuh login)
router.post('/', protect, createEvent);

// GET /api/events/myevents  → event yang dibuat user ini
router.get('/myevents', protect, getMyEvents);

// JOIN /api/events/:id/join
router.post('/:id/join', protect, joinEvent);

// LEAVE /api/events/:id/leave
router.post('/:id/leave', protect, leaveEvent);

// GET/PUT/DELETE /api/events/:id untuk detail/update/delete event tertentu
router
  .route('/:id')
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;

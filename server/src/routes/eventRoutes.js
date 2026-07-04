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
const validate = require('../middleware/validate');
const { createEventSchema, updateEventSchema } = require('../validators/eventSchema');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /api/events — List semua event (public, mendukung pagination & filter)
//   Query params: page, limit, category, location, search, priceType, upcoming, sort
router.get('/', getEvents);

// ============================================================
// PROTECTED ROUTES (butuh login)
// ============================================================

// POST /api/events — Buat event baru (dengan validasi Zod)
router.post('/', protect, validate(createEventSchema), createEvent);

// GET /api/events/myevents — Event yang dibuat oleh user ini
router.get('/myevents', protect, getMyEvents);

// POST /api/events/:id/join — Ikut event
router.post('/:id/join', protect, joinEvent);

// POST /api/events/:id/leave — Keluar dari event
router.post('/:id/leave', protect, leaveEvent);

// ============================================================
// SINGLE EVENT ROUTES
// ============================================================

// GET /api/events/:id — Detail event (public)
// PUT /api/events/:id — Update event (owner only, dengan validasi Zod)
// DELETE /api/events/:id — Hapus event (owner only)
router
  .route('/:id')
  .get(getEventById)
  .put(protect, validate(updateEventSchema), updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;

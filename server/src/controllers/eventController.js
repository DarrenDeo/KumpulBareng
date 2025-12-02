const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all events
// @route   GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

  const events = await prisma.event.findMany({
    take: limit, // Gunakan 'take' untuk membatasi hasil
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  res.status(200).json(events);
});

// @desc    Create a new event
// @route   POST /api/events
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, location, eventDate, price, maxParticipants } = req.body;

  if (!title || !description || !category || !location || !eventDate || !price || !maxParticipants) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category,
      location,
      eventDate: new Date(eventDate), // Pastikan format tanggal benar
      price,
      maxParticipants,
      authorId: req.user.id, // Ambil ID pengguna dari middleware
    },
  });

  res.status(201).json(event);
});

// @desc    Get single event
// @route   GET /api/events/:id
const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { name: true } },
      participants: { select: { id: true, name: true } }, // <-- TAMBAHKAN INI
    },
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.status(200).json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Pastikan pengguna adalah pemilik Events
  if (event.authorId !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEvent = await prisma.event.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      eventDate: new Date(req.body.eventDate),
    },
  });

  res.status(200).json(updatedEvent);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  // Pastikan pengguna adalah pemilik Events
  if (event.authorId !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await prisma.event.delete({ where: { id: req.params.id } });
  res.status(200).json({ id: req.params.id });
});

// @desc    Get user's events
// @route   GET /api/events/myevents
const getMyEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: {
      authorId: req.user.id, // Ambil ID dari pengguna yang login (dari middleware)
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.status(200).json(events);
});

// @desc    Join an event
// @route   POST /api/events/:id/join
const joinEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      participants: {
        connect: { id: userId },
      },
    },
  });
  res.status(200).json(event);
});

// @desc    Leave an event
// @route   POST /api/events/:id/leave
const leaveEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      participants: {
        disconnect: { id: userId },
      },
    },
  });
  res.status(200).json(event);
});



module.exports = {
  getEvents,
  createEvent,
  getEventById, 
  updateEvent,  
  deleteEvent,
  getMyEvents,
  joinEvent,
  leaveEvent,
};
const prisma = require('../lib/prismaClient');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendPaginated } = require('../utils/responseHelper');

// @desc    Get all events (with server-side pagination & filtering)
// @route   GET /api/events
// @access  Public
const getEvents = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  // Build filter conditions
  const where = {};

  // Filter by category
  if (req.query.category && req.query.category !== 'Semua') {
    where.category = req.query.category;
  }

  // Filter by location (partial match, case-insensitive)
  if (req.query.location) {
    where.location = { contains: req.query.location, mode: 'insensitive' };
  }

  // Search by title or description
  if (req.query.search) {
    where.OR = [
      { title: { contains: req.query.search, mode: 'insensitive' } },
      { description: { contains: req.query.search, mode: 'insensitive' } },
    ];
  }

  // Filter by price type
  if (req.query.priceType === 'gratis') {
    where.price = 0;
  } else if (req.query.priceType === 'berbayar') {
    where.price = { gt: 0 };
  }

  // Filter upcoming events only
  if (req.query.upcoming === 'true') {
    where.eventDate = { gte: new Date() };
  }

  // Determine sort order
  let orderBy = { createdAt: 'desc' }; // default: terbaru
  if (req.query.sort === 'date') {
    orderBy = { eventDate: 'asc' };
  } else if (req.query.sort === 'title') {
    orderBy = { title: 'asc' };
  }

  // Execute query with count in parallel
  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: { select: { name: true } },
        _count: { select: { participants: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  sendPaginated(res, events, { page, limit, total });
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = catchAsync(async (req, res) => {
  const { title, description, category, location, eventDate, price, maxParticipants } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category,
      location,
      eventDate: new Date(eventDate),
      price,
      maxParticipants,
      authorId: req.user.id,
      participants: {
        connect: { id: req.user.id },
      },
    },
    include: {
      author: { select: { name: true } },
    },
  });

  sendSuccess(res, event, 'Event berhasil dibuat!', 201);
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = catchAsync(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { id: true, name: true } },
      participants: { select: { id: true, name: true } },
      _count: { select: { participants: true } },
    },
  });

  if (!event) {
    throw new AppError('Event tidak ditemukan.', 404);
  }

  sendSuccess(res, event);
});

// @desc    Update an event (owner only)
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = catchAsync(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });

  if (!event) {
    throw new AppError('Event tidak ditemukan.', 404);
  }

  // FIX: Gunakan 403 (Forbidden) bukan 401 untuk authorization failures
  if (event.authorId !== req.user.id) {
    throw new AppError('Anda tidak memiliki izin untuk mengedit event ini.', 403);
  }

  // FIX: Whitelist field yang boleh diupdate (mencegah mass assignment)
  const allowedFields = ['title', 'description', 'category', 'location', 'eventDate', 'price', 'maxParticipants'];
  const updateData = {};
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = field === 'eventDate' ? new Date(req.body[field]) : req.body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError('Tidak ada data yang diubah.', 400);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: req.params.id },
    data: updateData,
    include: {
      author: { select: { name: true } },
    },
  });

  sendSuccess(res, updatedEvent, 'Event berhasil diperbarui!');
});

// @desc    Delete an event (owner only)
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = catchAsync(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { transactions: true } } },
  });

  if (!event) {
    throw new AppError('Event tidak ditemukan.', 404);
  }

  if (event.authorId !== req.user.id) {
    throw new AppError('Anda tidak memiliki izin untuk menghapus event ini.', 403);
  }

  // FIX: Handle related data sebelum delete
  // Hapus transaksi terkait, disconnect participants, lalu hapus event
  await prisma.$transaction(async (tx) => {
    // Hapus semua transaksi terkait event
    await tx.transaction.deleteMany({ where: { eventId: req.params.id } });
    
    // Disconnect semua participants
    await tx.event.update({
      where: { id: req.params.id },
      data: { participants: { set: [] } },
    });
    
    // Hapus event
    await tx.event.delete({ where: { id: req.params.id } });
  });

  sendSuccess(res, { id: req.params.id }, 'Event berhasil dihapus!');
});

// @desc    Get events created by current user
// @route   GET /api/events/myevents
// @access  Private
const getMyEvents = catchAsync(async (req, res) => {
  const events = await prisma.event.findMany({
    where: { authorId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { participants: true } },
    },
  });

  sendSuccess(res, events);
});

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  // Ambil event dengan participants untuk validasi
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: { select: { id: true } },
    },
  });

  if (!event) {
    throw new AppError('Event tidak ditemukan.', 404);
  }

  // FIX: Cek apakah user sudah menjadi peserta
  const alreadyJoined = event.participants.some((p) => p.id === userId);
  if (alreadyJoined) {
    throw new AppError('Anda sudah terdaftar sebagai peserta event ini.', 409);
  }

  // FIX: Cek kapasitas event
  if (event.participants.length >= event.maxParticipants) {
    throw new AppError('Event sudah penuh. Kapasitas maksimum tercapai.', 409);
  }

  // Cek apakah user adalah pemilik event (opsional: pemilik tidak bisa join event sendiri)
  if (event.authorId === userId) {
    throw new AppError('Anda tidak bisa bergabung ke event yang Anda buat sendiri.', 400);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      participants: { connect: { id: userId } },
    },
    include: {
      participants: { select: { id: true, name: true } },
      _count: { select: { participants: true } },
    },
  });

  sendSuccess(res, updatedEvent, 'Berhasil bergabung ke event!');
});

// @desc    Leave an event
// @route   POST /api/events/:id/leave
// @access  Private
const leaveEvent = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  // Cek apakah user memang peserta event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: { select: { id: true } },
    },
  });

  if (!event) {
    throw new AppError('Event tidak ditemukan.', 404);
  }

  const isParticipant = event.participants.some((p) => p.id === userId);
  if (!isParticipant) {
    throw new AppError('Anda bukan peserta event ini.', 400);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      participants: { disconnect: { id: userId } },
    },
    include: {
      participants: { select: { id: true, name: true } },
      _count: { select: { participants: true } },
    },
  });

  sendSuccess(res, updatedEvent, 'Berhasil keluar dari event.');
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
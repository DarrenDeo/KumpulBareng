const prisma = require('../lib/prismaClient');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/responseHelper');

/**
 * Dummy Payment System
 * 
 * Menggantikan integrasi Midtrans untuk development lokal.
 * Alur pembayaran tetap sama:
 * 1. Frontend request createTransaction → backend buat record PENDING
 * 2. Frontend panggil simulatePaymentSuccess → backend update status SUCCESS + connect participant
 * 
 * Untuk production, ganti kembali ke Midtrans Snap API.
 */

// @desc    Buat transaksi pembayaran (PENDING)
// @route   POST /api/payments/create-transaction
// @access  Private
const createTransaction = catchAsync(async (req, res) => {
  const { eventId } = req.body;
  const user = req.user;

  if (!eventId) {
    throw new AppError('Event ID wajib diisi.', 400);
  }

  // Ambil data event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: { select: { id: true } },
    },
  });

  if (!event) {
    throw new AppError('Event tidak ditemukan.', 404);
  }

  if (event.price <= 0) {
    throw new AppError('Event ini gratis. Gunakan endpoint join.', 400);
  }

  if (event.maxParticipants <= 0) {
    throw new AppError('Event tidak memiliki kapasitas yang valid.', 400);
  }

  // Cek apakah user sudah join
  const alreadyJoined = event.participants.some((p) => p.id === user.id);
  if (alreadyJoined) {
    throw new AppError('Anda sudah terdaftar sebagai peserta event ini.', 409);
  }

  // Cek kapasitas
  if (event.participants.length >= event.maxParticipants) {
    throw new AppError('Event sudah penuh.', 409);
  }

  // Cek apakah sudah ada transaksi PENDING untuk user+event ini
  const existingPending = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      eventId: eventId,
      status: 'PENDING',
    },
  });

  if (existingPending) {
    // Kembalikan transaksi yang sudah ada
    return sendSuccess(res, {
      transaction: existingPending,
      message: 'Transaksi sudah dibuat sebelumnya. Silakan selesaikan pembayaran.',
    });
  }

  // Hitung harga per orang
  const amount = Math.round(event.price / event.maxParticipants);
  const orderId = `KB-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // Buat transaksi PENDING
  const transaction = await prisma.transaction.create({
    data: {
      orderId,
      status: 'PENDING',
      amount,
      eventId,
      userId: user.id,
    },
  });

  sendSuccess(res, {
    transaction,
    paymentInfo: {
      orderId,
      amount,
      eventTitle: event.title,
      instructions: 'Gunakan endpoint POST /api/payments/simulate-success untuk simulasi pembayaran berhasil.',
    },
  }, 'Transaksi berhasil dibuat. Menunggu pembayaran.', 201);
});

// @desc    Simulasi pembayaran berhasil (DUMMY — pengganti Midtrans webhook)
// @route   POST /api/payments/simulate-success
// @access  Private
const simulatePaymentSuccess = catchAsync(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new AppError('Order ID wajib diisi.', 400);
  }

  // Cari transaksi
  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
  });

  if (!transaction) {
    throw new AppError('Transaksi tidak ditemukan.', 404);
  }

  if (transaction.status === 'SUCCESS') {
    throw new AppError('Transaksi ini sudah berhasil sebelumnya.', 409);
  }

  if (transaction.status === 'FAILED') {
    throw new AppError('Transaksi ini sudah gagal dan tidak dapat diproses.', 400);
  }

  // Pastikan transaksi milik user yang sedang login
  if (transaction.userId !== req.user.id) {
    throw new AppError('Anda tidak memiliki izin untuk transaksi ini.', 403);
  }

  // Proses pembayaran: update status + connect participant
  const [updatedTransaction] = await prisma.$transaction([
    prisma.transaction.update({
      where: { orderId },
      data: { status: 'SUCCESS' },
    }),
    prisma.event.update({
      where: { id: transaction.eventId },
      data: {
        participants: { connect: { id: transaction.userId } },
      },
    }),
  ]);

  sendSuccess(res, { transaction: updatedTransaction }, 'Pembayaran berhasil! Anda sekarang terdaftar sebagai peserta.');
});

// @desc    Simulasi pembayaran gagal (DUMMY)
// @route   POST /api/payments/simulate-failure
// @access  Private
const simulatePaymentFailure = catchAsync(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new AppError('Order ID wajib diisi.', 400);
  }

  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
  });

  if (!transaction) {
    throw new AppError('Transaksi tidak ditemukan.', 404);
  }

  if (transaction.status !== 'PENDING') {
    throw new AppError('Hanya transaksi PENDING yang bisa dibatalkan.', 400);
  }

  if (transaction.userId !== req.user.id) {
    throw new AppError('Anda tidak memiliki izin untuk transaksi ini.', 403);
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { orderId },
    data: { status: 'FAILED' },
  });

  sendSuccess(res, { transaction: updatedTransaction }, 'Transaksi dibatalkan.');
});

// @desc    Get transaksi user yang sedang login
// @route   GET /api/payments/my-transactions
// @access  Private
const getMyTransactions = catchAsync(async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      event: { select: { id: true, title: true, category: true } },
    },
  });

  sendSuccess(res, transactions);
});

module.exports = {
  createTransaction,
  simulatePaymentSuccess,
  simulatePaymentFailure,
  getMyTransactions,
};
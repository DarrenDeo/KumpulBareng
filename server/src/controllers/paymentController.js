const midtransClient = require('midtrans-client');
const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

// Inisialisasi Midtrans Snap API
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Fungsi untuk membuat transaksi (tidak berubah)
const createTransaction = asyncHandler(async (req, res) => {
    // ... kode Anda sebelumnya sudah benar ...
    const { eventId } = req.body;
    const user = req.user;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.maxParticipants <= 0) {
        res.status(400);
        throw new Error('Events tidak valid atau kapasitas tidak valid.');
    }

    const amount = Math.round(event.price / event.maxParticipants);
    const orderId = `KumpulBareng-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    await prisma.transaction.create({
        data: {
          orderId: orderId,
          status: 'PENDING',
          amount: amount,
          eventId: eventId,
          userId: user.id,
        },
    });

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount,
        },
        customer_details: {
            first_name: user.name,
            email: user.email,
        },
        item_details: [{
            id: event.id,
            price: amount,
            quantity: 1,
            name: `Tiket untuk Events: ${event.title}`,
        }],
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json(transaction);
});

// --- PERBAIKI FUNGSI INI ---
// Fungsi untuk menangani notifikasi webhook dari Midtrans
const handleNotification = asyncHandler(async (req, res) => {
  try {
    // Gunakan Core API untuk verifikasi yang lebih andal
    const notification = await snap.transaction.notification(req.body);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Transaksi diterima: Order ID ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

    const transaction = await prisma.transaction.findUnique({ where: { orderId } });
    if (!transaction) {
      // Jika transaksi tidak ditemukan, mungkin ini notifikasi tes. Kirim OK saja.
      console.log(`Transaksi dengan Order ID ${orderId} tidak ditemukan. Mungkin notifikasi tes.`);
      return res.status(200).send('OK');
    }

    if (transactionStatus == 'settlement' && fraudStatus == 'accept') {
      // Jika pembayaran sudah lunas dan aman
      await prisma.transaction.update({
        where: { orderId },
        data: { status: 'SUCCESS' },
      });
      await prisma.event.update({
        where: { id: transaction.eventId },
        data: { participants: { connect: { id: transaction.userId } } },
      });
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      // Jika pembayaran gagal atau kedaluwarsa
      await prisma.transaction.update({
        where: { orderId },
        data: { status: 'FAILED' },
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).send("Webhook Error");
  }
});
// -----------------------------

module.exports = { createTransaction, handleNotification };
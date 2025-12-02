require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const statsRoutes = require('./routes/statsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Kumpul Bareng API!' });
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);

  // Otomatis start ngrok kalau ENABLE_NGROK=true
  if (process.env.ENABLE_NGROK === 'true') {
    (async () => {
      try {
        const ngrok = require('ngrok');

        if (!process.env.NGROK_AUTHTOKEN) {
          console.warn(
            '⚠️  ENABLE_NGROK=true tetapi NGROK_AUTHTOKEN belum diset. Ngrok tidak akan dijalankan.'
          );
          return;
        }

        // Daftarkan authtoken dulu
        await ngrok.authtoken(process.env.NGROK_AUTHTOKEN);

        // Buka tunnel ke port backend di dalam container
        const url = await ngrok.connect({
          addr: PORT,
          proto: 'http',
          // region: 'ap', // kalau mau paksa region Asia, bisa aktifkan ini
        });

        console.log(`🌐 Ngrok tunnel aktif: ${url}`);
        console.log(
          `➡️  Set di Midtrans Payment Notification URL: ${url}/api/payments/notification`
        );
      } catch (err) {
        console.error('❌ Gagal mengaktifkan ngrok:');
        // log full object biar ketahuan masalah aslinya
        console.error(err);
      }
    })();
  }
});

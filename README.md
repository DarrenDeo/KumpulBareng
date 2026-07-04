<div align="center">
  <img src="https://via.placeholder.com/150/6366F1/FFFFFF?text=KB" alt="KumpulBareng Logo" width="120" height="120" style="border-radius: 20px; margin-bottom: 20px;" />
  <h1>🚀 KumpulBareng API & Web App v2.0</h1>
  <p><b>Platform Manajemen Event & Komunitas Modern dengan Arsitektur Enterprise-Grade</b></p>
</div>

---

## 🌟 Ringkasan Eksekutif
Proyek **KumpulBareng** baru saja melalui transformasi total (Fase 1 hingga Fase 7) dari sistem *proof-of-concept* menjadi aplikasi web *production-ready*. 

Sistem ini sekarang ditenagai oleh **Next.js 15 App Router** dengan desain Minimalis Premium (Light/Dark Mode via `next-themes`), **Node.js/Express Backend** yang tangguh (Winston Logger), serta **PostgreSQL** yang diakses secara efisien melalui *Singleton* **Prisma ORM**.

---

## ✨ Fitur & Peningkatan Utama

### 1. Keamanan & Autentikasi (Fase 1)
- **HttpOnly Cookies**: Menggantikan `localStorage` sepenuhnya untuk menyimpan JWT. Token aman dari serangan XSS.
- **Zod Validation**: Validasi skema data seketat mungkin sebelum menyentuh Controller. Melindungi sistem dari *Mass Assignment Vulnerability*.
- **Rate Limiting & Security Headers**: Terlindungi dari brute-force attack dan *payload bomb* (limit 10kb request body).

### 2. Desain Premium UI/UX (Fase 2 & Fase 6)
- **Minimalis & Clean Design**: Memberikan pengalaman pengguna yang sangat modern, bersih, fungsional menyerupai platform global (Loket.com).
- **True Light & Dark Mode**: Terintegrasi menggunakan `next-themes` tanpa *flash of unstyled content*. Toggle (Sun/Moon) tersedia di Navbar.
- **Smart Components**: Filter event canggih, *Pagination server-side*, indikator kapasitas progress-bar, dan *Skeleton loading state*.

### 3. Ketahanan Sistem / Error Handling (Fase 3)
- **Global Error Boundary (`error.tsx`)**: Menggagalkan "White Screen of Death" dan menggantinya dengan UI ramah bagi pengguna jika terjadi kegagalan *render*.
- **Offline / Network Indicator**: Peringatan seketika (Floating Banner) apabila koneksi internet pengguna terputus.
- **Custom AppError**: Tangkapan error dari Prisma (seperti *Unique Constraint* atau salah relasi) di-parse menjadi JSON yang mudah dimengerti *client*.

### 4. DevOps & Infrastruktur (Fase 4)
- **Next.js Standalone Build**: Ukuran Docker image Frontend ditekan dari **~1.5GB menjadi ~150MB**. Sangat ringan untuk Kubernetes.
- **Automated Database Migrations**: Perintah `npx prisma migrate deploy` diotomatiskan langsung pada startup *container* Backend. Tidak ada lagi migrasi manual!
- **Kubernetes Ready**: Tersedia *manifest* lengkap (Deployment, Service, ConfigMap, Secret) dengan probe *Health Check* pada `/healthz`.

### 5. Observability & Automated Testing (Fase 5)
- **Winston Structured Logging**: Backend tidak lagi menggunakan `console.log` liar. Semua log terstruktur (JSON format di production) sehingga mudah diindeks oleh Datadog / ELK / Grafana.
- **Playwright E2E Test Blueprint**: Tersedia draf spesifikasi pengujian *critical path* end-to-end pada `tests/e2e`.

---

## 🛠️ Cara Menjalankan Aplikasi (Lokal via Docker)

Seluruh dependensi (PostgreSQL, Backend Server, dan Frontend Next.js) telah dikonfigurasi dalam `docker-compose.yml`. Anda bisa menjalankan semuanya dengan 1 perintah:

### Prasyarat
- [Docker](https://www.docker.com/) dan Docker Compose terpasang.
- Port `3000` (Client), `5000` (Server), dan `5432` (Postgres) harus kosong di PC Anda.

### Langkah-langkah
1. **Clone & Masuk ke Folder**
   ```bash
   cd kumpulbareng
   ```
2. **Jalankan Docker Compose**
   ```bash
   docker-compose up --build -d
   ```
   > ⏳ *Catatan*: Build pertama mungkin memakan waktu beberapa menit karena Next.js sedang menyusun image standalone-nya.

3. **Akses Aplikasi**
   - 🌐 **Frontend (Web App)**: `http://localhost:3000`
   - ⚙️ **Backend API**: `http://localhost:5000/api`
   - 🏥 **Health Check API**: `http://localhost:5000/healthz`

### Menguji Tema & Pembayaran (Dummy Local)
Sistem ini menggunakan metode *simulasi pembayaran* (menggantikan Midtrans Snap untuk lingkungan lokal) dan memiliki tema interaktif:
1. **Light/Dark Mode**: Klik ikon Matahari/Bulan di Navbar (kanan atas) untuk melihat pergantian tema instan tanpa *reload*.
2. **Simulasi Pembayaran**: Register/Login menggunakan akun baru.
3. Buat event berbayar (misal harga: Rp 50.000).
4. Gunakan akun kedua, dan klik tombol **"Bayar & Bergabung"** pada event tersebut.
5. Sistem backend otomatis akan men-generate `orderId`, mensimulasikan proses pembayaran Midtrans, dan memperbarui status kapasitas secara langsung!

---

## 🧪 Cara Menjalankan E2E Testing (Playwright)
Draf blueprint testing sudah disiapkan. Jika Anda ingin menjalankannya:
```bash
# Pastikan server dan frontend berjalan
npm install -D @playwright/test
npx playwright install
npx playwright test
```

---

<div align="center">
  <p>Dikembangkan dengan ❤️ sebagai fondasi aplikasi Skala Enterprise.</p>
</div>

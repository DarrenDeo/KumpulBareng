# KumpulBareng

Platform **buat bikin & gabung acara bareng** (futsal, nonton, belajar bareng, dll.) dengan fitur **pembayaran online Midtrans**, statistik, dan infrastruktur yang sudah dibungkus dengan **Docker, Kubernetes, dan Terraform**.

---

## Daftar Isi

1. [Gambaran Umum Aplikasi](#gambaran-umum-aplikasi)
2. [Fitur Utama](#fitur-utama)
3. [Stack Teknologi](#stack-teknologi)
4. [Arsitektur & Alur Kerja](#arsitektur--alur-kerja)

   * [Alur di sisi pengguna](#alur-di-sisi-pengguna)
   * [Alur pembayaran Midtrans + ngrok](#alur-pembayaran-midtrans--ngrok)
5. [Struktur Project](#struktur-project)
6. [Konfigurasi Environment](#konfigurasi-environment)

   * [Environment backend (server)](#environment-backend-server)
   * [Environment frontend (client)](#environment-frontend-client)
   * [Secrets di Kubernetes / Terraform](#secrets-di-kubernetes--terraform)
7. [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)

   * [Mode A – Docker + script `run-all.ps1`](#mode-a--docker--script-run-allps1)
   * [Mode B – Jalankan manual tanpa Docker](#mode-b--jalankan-manual-tanpa-docker)
   * [Mode C – Kubernetes (apply YAML di folder `k8s/`)](#mode-c--kubernetes-apply-yaml-di-folder-k8s)
   * [Mode D – Kubernetes dengan Terraform (`infra/terraform`)](#mode-d--kubernetes-dengan-terraform-infraterraform)
8. [Catatan Database & Prisma](#catatan-database--prisma)
9. [Endpoint API (ringkas)](#endpoint-api-ringkas)
10. [Pengembangan Lanjutan](#pengembangan-lanjutan)
11. [Catatan Lisensi](#catatan-lisensi)

---

## Gambaran Umum Aplikasi

**KumpulBareng** adalah aplikasi web untuk:

* Membuat acara (event) komunitas / tongkrongan.
* Mengatur kapasitas dan harga per acara.
* Mengundang orang lain untuk ikut.
* Mengelola pembayaran tiket via **Midtrans Snap**.
* Melihat **statistik** event dan aktivitas pengguna.

Aplikasi dipisah menjadi dua bagian besar:

* **Frontend** – Next.js (TypeScript, Tailwind) di folder `client/`.
* **Backend API** – Node.js + Express + Prisma + PostgreSQL di folder `server/`.

Lalu dibungkus dengan:

* **Docker** untuk containerisasi.
* **Kubernetes** sebagai orkestrasi container.
* **Terraform** untuk mendeskripsikan resource Kubernetes sebagai Infrastructure as Code.
* **ngrok** untuk membuka endpoint backend ke internet supaya **Midtrans** bisa mengirim **webhook** pembayaran.

---

## Fitur Utama

* **Autentikasi & akun pengguna**

  * Registrasi & login.
  * Autentikasi pakai **JWT** di backend.

* **Manajemen event**

  * Buat event baru (judul, deskripsi, kategori, lokasi, tanggal & waktu, kapasitas, harga total).
  * Edit event yang sudah dibuat.
  * Hapus event (dengan aturan referensi database).
  * Daftar peserta yang mengikuti event.

* **Join / leave event**

  * Pengguna bisa klik **Ikut Acara**.
  * Untuk event berbayar, join akan diarahkan ke proses pembayaran Midtrans.
  * Pengguna bisa **batalkan keikutsertaan** dari halaman detail event.

* **Pembayaran online (Midtrans Snap)**

  * Hitung harga **per orang** dari `total_price / maxParticipants`.
  * Buat transaksi di database (`Transaction`).
  * Panggil Midtrans Snap untuk membuat transaksi.
  * Midtrans memanggil webhook `/api/payments/notification` (via URL ngrok).
  * Setelah pembayaran sukses, backend otomatis:

    * Update status transaksi menjadi `SUCCESS`.
    * Menghubungkan user ke event sebagai peserta (tambah ke `participants`).

* **Dashboard & statistik**

  * Ringkasan event yang dibuat & diikuti.
  * Statistik peserta & (opsional) omzet pembayaran.
  * Komponen chart di frontend untuk menampilkan data secara visual.

* **Infra / DevOps**

  * Dockerfile untuk **client** dan **server**.
  * `run-all.ps1` dan `stop-all.ps1` untuk menjalankan stack Docker dengan sekali jalan.
  * Manifest Kubernetes di folder `k8s/` (namespace, config, secret, postgres, server, client, ngrok).
  * Terraform di `infra/terraform` untuk membuat resource Kubernetes yang sama secara declarative.

---

## Stack Teknologi

**Frontend (client/)**

* [Next.js 14](https://nextjs.org/) – App Router.
* [React](https://react.dev/) + TypeScript.
* [Tailwind CSS](https://tailwindcss.com/) untuk styling.
* `axios` untuk HTTP request ke backend.
* `react-hot-toast` untuk notifikasi.

**Backend (server/)**

* [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/).
* [Prisma ORM](https://www.prisma.io/) untuk akses PostgreSQL.
* [PostgreSQL](https://www.postgresql.org/) sebagai database utama.
* `jsonwebtoken` + `bcryptjs` untuk autentikasi.
* `midtrans-client` untuk integrasi pembayaran.

**Infra**

* [Docker](https://www.docker.com/) untuk container client, server, dan Postgres.
* [Kubernetes](https://kubernetes.io/) untuk mengelola pod, service, volume, dll.
* [Terraform](https://www.terraform.io/) + provider `kubernetes` untuk mendefinisikan resource K8s sebagai kode.
* [ngrok](https://ngrok.com/) untuk membuat URL publik ke backend lokal.

---

## Arsitektur & Alur Kerja

Secara garis besar, arsitektur KumpulBareng seperti ini:

```text
[Browser] ── HTTP ──> [kb-client (Next.js)] ──> [kb-server (Express API)] ──> [PostgreSQL]
                                                 │
                                                 └──> [Midtrans Snap API]
                                                         ▲
                                                         │ webhook
                                                [ngrok tunnel]
```

### Alur di sisi pengguna

1. Pengguna membuka **frontend** di `http://localhost:3000`.
2. Frontend menyimpan **JWT** di `localStorage` setelah login.
3. Untuk setiap request yang butuh autentikasi, frontend mengirim header `Authorization: Bearer <token>` ke backend.
4. Backend memverifikasi token dan menginject `req.user` (id, name, email, dll.).
5. Untuk halaman event:

   * `GET /api/events` → list event.
   * `GET /api/events/:id` → detail event.
   * `POST /api/events` → buat event baru (hanya user terautentikasi).
6. Untuk join event:

   * Jika event **gratis** → langsung `POST /api/events/:id/join`.
   * Jika event **berbayar** → `POST /api/payments/create-transaction`, lalu diarahkan ke Midtrans.

### Alur pembayaran Midtrans + ngrok

1. Di halaman detail event, tombol **Ikut & Bayar** memanggil endpoint:

   ```text
   POST /api/payments/create-transaction
   Body: { eventId }
   ```

2. Backend:

   * Mengambil data event dari database.
   * Menghitung `amount = event.price / event.maxParticipants`.
   * Membuat baris baru di tabel `Transaction` dengan status `PENDING`.
   * Memanggil `snap.createTransaction(parameter)` dari `midtrans-client`.

3. Midtrans mengembalikan **transaction token**.

4. Frontend memanggil `window.snap.pay(transactionToken, ...)` untuk membuka popup pembayaran Snap.

5. Setelah user melakukan pembayaran, Midtrans akan mengirim **notifikasi webhook** ke URL yang kita set di dashboard Midtrans:

   ```text
   https://{random}.ngrok-free.app/api/payments/notification
   ```

6. URL di atas sebenarnya:

   * Mengarah ke **ngrok**.
   * Ngrok meneruskan request ke `kb-server:5000` (pod/ container backend).
   * Di backend, route `/api/payments/notification` menangani notifikasi:

     * Memverifikasi notifikasi via Midtrans API.
     * Mengupdate `Transaction.status` menjadi `SUCCESS` / `FAILED` sesuai status.
     * Jika sukses → menambahkan user ke daftar peserta event di database.

7. Saat user membuka ulang halaman event atau dashboard:

   * Backend menarik data terbaru dari database.
   * Frontend menampilkan status sudah ikut / belum.

---

## Struktur Project

Struktur folder utama (disederhanakan):

```text
KumpulBareng/
├─ client/                 # Next.js frontend
│  ├─ Dockerfile
│  ├─ .dockerignore
│  ├─ .gitignore
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ (auth)/login
│  │  │  ├─ (auth)/register
│  │  │  ├─ dashboard/
│  │  │  ├─ events/
│  │  │  ├─ profile/
│  │  │  └─ ...
│  │  └─ components/
│  └─ ...
├─ server/                 # Express + Prisma backend
│  ├─ Dockerfile
│  ├─ .dockerignore
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ migrations/
│  └─ src/
│     ├─ index.js          # Entry point (Express + ngrok-optional)
│     ├─ controllers/
│     ├─ routes/
│     └─ middleware/
├─ k8s/                    # Manifest Kubernetes (yaml)
│  ├─ namespace.yaml
│  ├─ config-and-secrets.yaml
│  ├─ postgres.yaml
│  ├─ server.yaml
│  ├─ client.yaml
│  └─ ngrok.yaml
├─ infra/
│  └─ terraform/           # Terraform untuk resource Kubernetes
│     ├─ main.tf
│     ├─ apps.tf
│     ├─ postgres.tf
│     ├─ config-and-secrets.tf
│     ├─ variables.tf
│     ├─ terraform.tfvars.example
│     └─ .terraform.lock.hcl
├─ docker-compose.yml      # (opsional, untuk orkestrasi Docker)
├─ run-all.ps1             # Script PowerShell untuk jalankan stack Docker
├─ stop-all.ps1            # Script PowerShell untuk stop container utama
└─ package.json / yarn.lock
```

---

## Konfigurasi Environment

### Environment backend (server)

Backend membaca environment variable, di antaranya:

* `PORT` – default `5000`.

* `NODE_ENV` – `development` / `production`.

* `CLIENT_URL` – asal request frontend, contoh: `http://localhost:3000`.

* `DATABASE_URL` – koneksi PostgreSQL (untuk Prisma), contoh:

  ```text
  postgresql://myuser:mypassword@kb-postgres:5432/kumpulbareng_db
  ```

* `MIDTRANS_SERVER_KEY` – server key Midtrans (Sandbox).

* `MIDTRANS_CLIENT_KEY` – client key Midtrans (Sandbox).

* `JWT_SECRET` – secret string untuk sign JWT.

* `ENABLE_NGROK` – `true` / `false` untuk mengaktifkan ngrok otomatis dari backend (saat tidak pakai pod ngrok).

* `NGROK_AUTHTOKEN` – token ngrok (kalau backend yang menginisiasi ngrok langsung).

Di mode **Docker**, nilai ini diset lewat argumen `-e` di `docker run` (lihat `run-all.ps1`) atau lewat manifest Kubernetes / Terraform.

### Environment frontend (client)

Frontend terutama butuh:

* `NEXT_PUBLIC_API_URL` – base URL API backend, contoh:

  ```text
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```

Karena prefiks `NEXT_PUBLIC_`, variabel ini dibundel ke client-side dan dibaca di kode seperti:

```ts
axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
```

### Secrets di Kubernetes / Terraform

Di Kubernetes, konfigurasi & secrets dipisah:

* **ConfigMap** (misal `kb-app-config`):

  * `CLIENT_URL`
  * `NEXT_PUBLIC_API_URL`
  * detail DB host / nama / port.

* **Secret** (misal `kb-app-secrets`):

  * `MIDTRANS_SERVER_KEY`
  * `MIDTRANS_CLIENT_KEY`
  * `JWT_SECRET`
  * `NGROK_AUTHTOKEN`
  * `POSTGRES_PASSWORD` (jika disimpan sebagai secret).

Di Terraform (`infra/terraform/terraform.tfvars`), nilai sensitif dimasukkan dalam variabel seperti:

```hcl
midtrans_server_key = "Mid-server-..."
midtrans_client_key = "Mid-client-..."
jwt_secret          = "random-secret-yang-panjang"
ngrok_authtoken     = "xxx"
postgres_password   = "mypassword"
```

> **Penting:** Jangan pernah commit key asli ke git publik. Gunakan file `.tfvars` lokal, `.env`, atau secret manager lain yang tidak ikut dipush.

---

## Cara Menjalankan Aplikasi

Ada beberapa cara jalanin stack ini, dari yang paling simpel sampai full Kubernetes + Terraform.

### Mode A – Docker + script `run-all.ps1`

Ini mode paling mudah kalau kamu pakai **Windows + PowerShell** dan sudah install Docker Desktop.

**Prasyarat:**

* Docker Desktop terinstall dan berjalan.
* PowerShell.
* Akun Midtrans Sandbox (untuk mendapatkan Server Key & Client Key).

**Langkah:**

1. Clone repo:

   ```powershell
   git clone https://github.com/DarrenDeo/KumpulBareng.git
   cd KumpulBareng
   ```

2. Buka file `run-all.ps1` dan isi parameter default (lihat bagian paling atas):

   ```powershell
   [string]$MidtransServerKey = "Mid-server-ISI_PUNYAMU_DI_SINI"
   [string]$MidtransClientKey = "Mid-client-ISI_PUNYAMU_DI_SINI"
   [string]$JwtSecret         = "ganti_jwt_secret_yang_panjang_dan_random"
   ```

3. Jalankan script:

   ```powershell
   .\run-all.ps1
   ```

   Script ini akan otomatis:

   * Membuat Docker network `kumpulbareng-net` (kalau belum ada).
   * Menjalankan `kb-postgres` (PostgreSQL 15).
   * Build image `kb-server` dan menjalankan container backend.
   * Build image `kb-client` dan menjalankan container frontend.

4. Di PowerShell baru, jalankan ngrok manual:

   ```powershell
   ngrok http 5000
   ```

   Ambil URL forwarding `https://xxxx.ngrok-free.app` dari output ngrok.

5. Di dashboard Midtrans Sandbox, set **Payment Notification URL** menjadi:

   ```text
   https://xxxx.ngrok-free.app/api/payments/notification
   ```

6. Buka aplikasi:

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend API (untuk cek sederhana): [http://localhost:5000/api](http://localhost:5000/api)

### Mode B – Jalankan manual tanpa Docker

Kalau kamu mau develop tanpa Docker (langsung dari Node.js):

**Prasyarat:**

* Node.js (disarankan versi LTS).
* PostgreSQL lokal.

1. Siapkan database:

   * Buat database `kumpulbareng_db`.
   * Buat user `myuser` dengan password sendiri.

2. Konfigurasi backend:

   ```bash
   cd server
   npm install
   ```

   Buat file `.env` di folder `server/`:

   ```env
   DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/kumpulbareng_db
   CLIENT_URL=http://localhost:3000
   MIDTRANS_SERVER_KEY=Mid-server-...
   MIDTRANS_CLIENT_KEY=Mid-client-...
   JWT_SECRET=some-long-secret
   ENABLE_NGROK=false
   ```

   Jalankan migrasi prisma:

   ```bash
   npx prisma migrate deploy
   ```

   Lalu jalankan backend:

   ```bash
   npm run dev
   # atau
   npm start
   ```

3. Konfigurasi frontend:

   ```bash
   cd ../client
   npm install
   ```

   Buat `.env.local` di `client/`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   Jalankan frontend:

   ```bash
   npm run dev
   ```

4. Jalankan ngrok manual seperti di Mode A dan set Payment Notification URL di Midtrans.

### Mode C – Kubernetes (apply YAML di folder `k8s/`)

Mode ini mengasumsikan kamu sudah punya **cluster Kubernetes lokal** (misalnya dari Docker Desktop, minikube, atau kind) dan `kubectl` sudah terhubung ke cluster tersebut.

1. Pastikan context kubectl benar:

   ```bash
   kubectl config current-context
   ```

2. Apply namespace & config:

   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/config-and-secrets.yaml
   ```

   > **Catatan:** Edit dulu `k8s/config-and-secrets.yaml` untuk mengisi value Midtrans, JWT, ngrok token, dsb. Jangan commit perubahan ini ke repo publik.

3. Apply database, backend, frontend, dan ngrok:

   ```bash
   kubectl apply -f k8s/postgres.yaml
   kubectl apply -f k8s/server.yaml
   kubectl apply -f k8s/client.yaml
   kubectl apply -f k8s/ngrok.yaml
   ```

4. Cek pod di namespace:

   ```bash
   kubectl get pods -n kumpulbareng
   ```

5. Akses frontend dengan **port-forward**:

   ```bash
   kubectl port-forward svc/kb-client 3000:3000 -n kumpulbareng
   ```

   Lalu buka `http://localhost:3000` di browser.

6. Ngrok di mode ini dijalankan sebagai **pod** (`kb-ngrok`) yang mengarah ke service `kb-server`. Ambil URL tunnel dari log pod ngrok:

   ```bash
   kubectl logs deploy/kb-ngrok -n kumpulbareng
   ```

   Di sana biasanya tercetak URL seperti `https://xxxx.ngrok-free.app`. Pakai URL ini sebagai Payment Notification URL di Midtrans.

### Mode D – Kubernetes dengan Terraform (`infra/terraform`)

Mode ini mirip Mode C, tapi resource Kubernetes dicreate oleh Terraform.

1. Pastikan cluster Kubernetes sudah berjalan dan `kubectl` bisa mengaksesnya.

2. Masuk ke folder terraform:

   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Edit `terraform.tfvars` dan isi:

   * `postgres_password`
   * `midtrans_server_key`
   * `midtrans_client_key`
   * `jwt_secret`
   * `ngrok_authtoken`

4. Jalankan:

   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

5. Setelah apply sukses, semua resource (namespace, PVC, postgres, kb-server, kb-client, kb-ngrok, configmap, secret, service) akan dibuat di namespace `kumpulbareng`.

6. Sama seperti Mode C, gunakan `kubectl port-forward` untuk akses frontend:

   ```bash
   kubectl port-forward svc/kb-client 3000:3000 -n kumpulbareng
   ```

7. Ambil URL ngrok dari log deployment `kb-ngrok` dan set di dashboard Midtrans.

---

## Catatan Database & Prisma

* Skema database diatur di `server/prisma/schema.prisma`.

* Migrations ada di `server/prisma/migrations/`.

* Saat kamu mengubah model (tambah kolom, tabel, relasi), jalankan:

  ```bash
  cd server
  npx prisma migrate dev --name nama_migrasi
  ```

* Di lingkungan produksi (atau di dalam container), biasanya pakai:

  ```bash
  npx prisma migrate deploy
  ```

Prisma akan otomatis generate client ke folder `node_modules/@prisma/client` setiap container backend start.

---

## Endpoint API (ringkas)

Ini ringkasan path utama (prefix: `/api`). Detail implementasi bisa dilihat di folder `server/src/routes` dan `server/src/controllers`.

* **Users** (`/api/users`)

  * `POST /register` – registrasi pengguna baru.
  * `POST /login` – login, mengembalikan JWT.
  * (Opsional) `GET /me` atau serupa untuk ambil profil user.

* **Events** (`/api/events`)

  * `GET /` – list semua event.
  * `GET /:id` – detail event.
  * `POST /` – buat event (butuh JWT).
  * `PUT /:id` – edit event (owner saja).
  * `DELETE /:id` – hapus event (owner + tidak melanggar constraint DB).
  * `POST /:id/join` – ikut event (gratis).
  * `POST /:id/leave` – batal ikut event.

* **Stats** (misal `/api/stats`)

  * Endpoint statistik (total event, peserta, dsb.), dipakai oleh dashboard frontend.

* **Payments** (`/api/payments`)

  * `POST /create-transaction` – buat transaksi Midtrans Snap.
  * `POST /notification` – endpoint webhook pembayaran dari Midtrans.

---

## Pengembangan Lanjutan

Beberapa ide pengembangan selanjutnya:

* Tambah filter & search event (by lokasi, kategori, tanggal).
* Tambah role admin & halaman khusus admin.
* Tambah email notification untuk peserta.
* Tambah support variasi harga (early bird, dsb.).
* Deploy ke cloud Kubernetes (misal GKE / EKS) dan gunakan Terraform untuk provisioning cluster sekaligus.

---

## Catatan Lisensi

Saat ini repo belum menyertakan file lisensi resmi. Untuk penggunaan di luar keperluan belajar / tugas pribadi, sebaiknya diskusikan dulu dengan pemilik repository.

---

Selamat bereksperimen dengan **KumpulBareng**. 🎉

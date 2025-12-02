/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan blok konfigurasi eslint ini
  eslint: {
    // Peringatan: Ini akan mengizinkan build produksi selesai 
    // meskipun proyek Anda memiliki error ESLint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
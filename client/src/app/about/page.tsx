export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Tentang KumpulBareng
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Menghubungkan orang, mewujudkan rencana.
        </p>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Visi Kami</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Menciptakan platform di mana setiap orang dapat dengan mudah menemukan komunitas dan teman untuk melakukan aktivitas yang mereka sukai, mengubah ide menjadi pengalaman nyata.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Misi Kami</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Menyediakan alat yang intuitif dan aman untuk merencanakan Events, menemukan peserta, dan membangun koneksi sosial yang positif melalui minat dan hobi yang sama.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Perjalanan Kami
        </h2>
        <div className="relative border-l-2 border-blue-500 ml-6">
          {/* Timeline Item 1 */}
          <div className="mb-10 ml-10">
            <div className="absolute -left-4 top-1 w-8 h-8 bg-blue-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Oktober 2025</h3>
            <p className="text-gray-600 dark:text-gray-400">Ide Awal & Pengembangan. Proyek "KumpulBareng" dimulai dengan tujuan sederhana: mempermudah orang mencari teman untuk beraktivitas.</p>
          </div>

          {/* Timeline Item 2 */}
          <div className="mb-10 ml-10">
            <div className="absolute -left-4 top-1 w-8 h-8 bg-blue-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">November 2025</h3>
            <p className="text-gray-600 dark:text-gray-400">Peluncuran Versi Beta. Fitur inti seperti registrasi, login, dan pembuatan Events berhasil diimplementasikan.</p>
          </div>

          {/* Timeline Item 3 (Contoh) */}
          <div className="mb-10 ml-10">
            <div className="absolute -left-4 top-1 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Masa Depan</h3>
            <p className="text-gray-600 dark:text-gray-400">Terus mengembangkan fitur baru berdasarkan masukan dari komunitas pengguna.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
import { motion } from 'framer-motion';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center container-custom py-16">
      <div className="text-center max-w-lg w-full">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md">
            <FileQuestion className="w-16 h-16 text-primary-600 dark:text-primary-400" />
            <span className="absolute -bottom-2 -right-2 text-6xl font-black text-slate-100 dark:text-slate-800 select-none">
              404
            </span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Halaman Tidak Ditemukan
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
          Maaf, halaman yang kamu cari mungkin telah dihapus, diubah namanya, atau tidak pernah ada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary btn-lg">
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          
          <Link href="/events" className="btn-secondary btn-lg">
            <Search className="w-5 h-5" />
            Cari Event
          </Link>
        </div>
      </div>
    </div>
  );
}

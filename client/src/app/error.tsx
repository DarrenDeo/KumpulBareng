'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center container-custom py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-8 md:p-12 text-center max-w-lg w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Oops! Terjadi Kesalahan
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Maaf, terjadi kesalahan tak terduga pada sistem kami. Kami telah mencatat masalah ini dan sedang memperbaikinya.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/30 text-left overflow-auto max-h-40">
            <p className="text-red-500 dark:text-red-400 text-xs font-mono mb-2">{error.message}</p>
            <p className="text-slate-500 text-xs font-mono whitespace-pre-wrap">{error.stack}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

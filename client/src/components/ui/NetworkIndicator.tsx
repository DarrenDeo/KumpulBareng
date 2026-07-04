'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

export default function NetworkIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Return early if not in browser
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 pointer-events-none"
        >
          <div className="bg-red-50 dark:bg-red-500 text-red-600 dark:text-white px-4 py-2 rounded-full shadow-md border border-red-200 dark:border-red-600 flex items-center gap-2 pointer-events-auto">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Anda sedang offline. Periksa koneksi internet Anda.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

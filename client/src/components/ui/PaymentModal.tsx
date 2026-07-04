'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  orderId: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, orderId }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulate = async () => {
    setIsProcessing(true);
    // Add artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Pembayaran Aman</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Total Tagihan</h4>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">
                {formatCurrency(amount)}
              </p>

              {/* QRIS Dummy */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white border-2 border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center shadow-inner mb-6">
                <QrCode className="w-24 h-24 text-slate-300" strokeWidth={1.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <span className="font-extrabold text-blue-600">KB</span>
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">KumpulBareng Pay</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-xl text-sm font-medium w-full mb-6 flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Scan kode QR ini menggunakan aplikasi m-banking atau e-wallet Anda.</p>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={handleSimulate}
                  disabled={isProcessing}
                  className="btn-primary w-full justify-center py-3 text-base shadow-lg shadow-blue-500/25"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Simulasikan Pembayaran'
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="btn-ghost w-full justify-center text-slate-500"
                >
                  Batalkan
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-6">Order ID: {orderId}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

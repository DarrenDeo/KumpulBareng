'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <button onClick={() => router.back()} className="btn-ghost text-slate-500 -ml-4 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="glass-card p-8 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-primary-600 mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-6">
            {getInitials(user.name)}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user.name || 'User'}</h1>
          <p className="text-sm font-medium text-slate-500 mb-8">Member KumpulBareng</p>

          <div className="space-y-4 text-left">
            <div className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shadow-sm">
                <UserCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Nama</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name || '-'}</p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Email</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Bergabung Sejak</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, User, Lock, Bell, Shield, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      toast.success('Pengaturan berhasil disimpan');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <button onClick={() => router.back()} className="btn-ghost text-slate-500 -ml-4 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Akun</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              Profil Umum
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'security'
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              Keamanan
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifikasi
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              Privasi
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="glass-card p-6 md:p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profil Umum</h2>
                  <form onSubmit={handleSave} className="space-y-5">
                    <div>
                      <label className="input-label">Nama Lengkap</label>
                      <input type="text" defaultValue={user.name || ''} className="input-base" />
                    </div>
                    <div>
                      <label className="input-label">Alamat Email</label>
                      <input type="email" defaultValue={user.email} className="input-base" disabled />
                      <p className="text-xs text-slate-500 mt-1">Email tidak dapat diubah</p>
                    </div>
                    <div>
                      <label className="input-label">Bio Singkat</label>
                      <textarea rows={4} placeholder="Ceritakan sedikit tentang dirimu..." className="input-base resize-none" />
                    </div>
                    <div className="pt-4">
                      <button type="submit" disabled={isSaving} className="btn-primary">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Ubah Password</h2>
                  <form onSubmit={handleSave} className="space-y-5">
                    <div>
                      <label className="input-label">Password Saat Ini</label>
                      <input type="password" placeholder="••••••••" className="input-base" />
                    </div>
                    <div>
                      <label className="input-label">Password Baru</label>
                      <input type="password" placeholder="••••••••" className="input-base" />
                    </div>
                    <div>
                      <label className="input-label">Konfirmasi Password Baru</label>
                      <input type="password" placeholder="••••••••" className="input-base" />
                    </div>
                    <div className="pt-4">
                      <button type="submit" disabled={isSaving} className="btn-primary">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {(activeTab === 'notifications' || activeTab === 'privacy') && (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Segera Hadir</h3>
                  <p className="text-slate-500 text-sm">
                    Fitur pengaturan {activeTab === 'notifications' ? 'notifikasi' : 'privasi'} masih dalam tahap pengembangan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
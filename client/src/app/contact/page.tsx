'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Pesan Anda telah terkirim! Terima kasih.');
      setForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Hubungi <span className="text-primary-600">Kami</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Punya pertanyaan, masukan, atau ingin bekerja sama? 
            Tim KumpulBareng siap membantu Anda.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Untuk dukungan & pertanyaan umum</p>
            <a href="mailto:halo@kumpulbareng.id" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold text-sm transition-colors">
              halo@kumpulbareng.id
            </a>
          </div>

          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Telepon / WhatsApp</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Senin - Jumat, 09:00 - 17:00 WIB</p>
            <a href="tel:+6281234567890" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold text-sm transition-colors">
              +62 812 3456 7890
            </a>
          </div>

          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Kantor Pusat</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Gedung Inovasi Lt. 4<br />
              Jl. Jend. Sudirman Kav. 1<br />
              Jakarta Selatan 12190
            </p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-8 md:p-10 h-full">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="input-label">Nama Lengkap</label>
                  <input 
                    id="name" 
                    type="text" 
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Nama kamu" 
                    className="input-base" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="input-label">Alamat Email</label>
                  <input 
                    id="email" 
                    type="email" 
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="nama@email.com" 
                    className="input-base" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="input-label">Pesan</label>
                <textarea 
                  id="message" 
                  rows={6}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Tuliskan pesan, pertanyaan, atau masukan Anda di sini..." 
                  className="input-base resize-none" 
                  required 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center btn-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pesan Sekarang
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
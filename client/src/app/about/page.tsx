'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Target, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container-custom py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            Menghubungkan Orang,<br />
            <span className="text-primary-600">Mewujudkan Rencana</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            KumpulBareng berawal dari ide sederhana: mempermudah setiap orang untuk 
            menemukan teman sehobi dan melakukan aktivitas positif bersama.
          </p>
        </motion.div>
      </section>

      {/* Visi & Misi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 md:p-10"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Visi Kami</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Menciptakan platform di mana setiap orang dapat dengan mudah menemukan komunitas 
            dan teman untuk melakukan aktivitas yang mereka sukai, mengubah ide menjadi 
            pengalaman nyata yang tak terlupakan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-8 md:p-10"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Misi Kami</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Menyediakan platform yang intuitif, aman, dan inklusif untuk merencanakan event, 
            menemukan peserta, dan membangun koneksi sosial yang positif melalui minat 
            dan hobi yang sama di seluruh Indonesia.
          </p>
        </motion.div>
      </section>

      {/* Nilai Utama */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Nilai <span className="text-primary-600">Utama</span> Kami</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Koneksi Asli',
              desc: 'Kami percaya pada interaksi nyata dan koneksi bermakna yang terbentuk melalui kesamaan minat.',
              color: 'bg-blue-500'
            },
            {
              title: 'Keamanan Komunitas',
              desc: 'Menciptakan lingkungan yang aman dan terpercaya bagi semua pengguna adalah prioritas utama kami.',
              color: 'bg-emerald-500'
            },
            {
              title: 'Aksesibilitas',
              desc: 'Platform yang mudah digunakan oleh siapa saja, kapan saja, dan di mana saja.',
              color: 'bg-amber-500'
            }
          ].map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className={`w-12 h-12 rounded-full ${val.color} mx-auto mb-4 flex items-center justify-center text-white font-bold shadow-md`}>
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{val.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="rounded-3xl p-10 md:p-16 border border-primary-100 bg-primary-50 dark:border-primary-500/20 dark:bg-primary-900/10">
          <Users className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Mulai Perjalananmu</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Bergabunglah dengan ribuan pengguna lainnya yang telah menemukan 
            komunitas dan teman baru di KumpulBareng.
          </p>
          <Link href="/register" className="btn-primary btn-lg inline-flex">
            Daftar Sekarang Gratis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
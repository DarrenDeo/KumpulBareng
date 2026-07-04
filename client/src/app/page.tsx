'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Users,
  CalendarDays,
  Compass,
  TrendingUp,
  Search,
  ChevronRight,
  Globe,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { eventService } from '@/lib/api/services/event.service';
import { statsService } from '@/lib/api/services/stats.service';
import EventCard from '@/components/ui/EventCard';
import { CATEGORY_COLORS, VALID_CATEGORIES } from '@/types';
import type { Event, SiteStats } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await eventService.getEvents({ limit: 6, upcoming: 'true', sort: 'date' });
        setEvents(res.data);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative">
      {/* ============================================================
          HERO SECTION (Minimalist Ticketing Style)
          ============================================================ */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight"
            >
              Temukan Event Seru, <br className="hidden sm:block" />
              <span className="text-primary-600">Kumpul Bareng</span> Teman Baru
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Platform pencarian dan manajemen event terbaik di Indonesia. Mulai dari konser, workshop, hingga mabar esports.
            </motion.p>

            {/* Search Bar - Loket style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 max-w-2xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700">
                <Search className="absolute left-6 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama event, artis, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button type="submit" className="btn-primary rounded-xl px-6">
                  Cari
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          KATEGORI SECTION
          ============================================================ */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kategori Pilihan</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Jelajahi event berdasarkan minat kamu</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {VALID_CATEGORIES.map((cat, i) => {
              return (
                <motion.div key={cat} variants={fadeInUp} custom={i}>
                  <Link
                    href={`/events?category=${cat}`}
                    className="flex flex-col items-center justify-center p-4 h-full text-center group rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-xl mb-3 group-hover:scale-110 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-all">
                      {CATEGORY_COLORS[cat].icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {cat}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          EVENT MENDATANG SECTION
          ============================================================ */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Event Mendatang</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Jangan lewatkan keseruannya</p>
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0 overflow-hidden">
                  <div className="h-40 skeleton rounded-b-none" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 skeleton w-3/4" />
                    <div className="h-4 skeleton w-1/2" />
                    <div className="h-10 skeleton w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CalendarDays className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2">
                Belum ada event mendatang
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Jadilah yang pertama membuat event seru!
              </p>
              <Link href="/events/create" className="btn-primary">
                Buat Event Pertama
              </Link>
            </div>
          )}

          {/* Mobile: Show All link */}
          <div className="sm:hidden mt-8 text-center">
            <Link href="/events" className="btn-secondary w-full justify-center">
              Lihat Semua Event
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
          ============================================================ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mengapa KumpulBareng?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Jangkauan Luas',
                description: 'Temukan ribuan event dari berbagai kota dan kategori yang sesuai dengan minat Anda.',
              },
              {
                icon: ShieldCheck,
                title: 'Aman & Terpercaya',
                description: 'Transaksi dilindungi oleh sistem keamanan tinggi. Tiket digital langsung masuk ke email.',
              },
              {
                icon: CalendarCheck,
                title: 'Mudah Kelola Event',
                description: 'Dashboard organizer yang lengkap untuk mengelola penjualan, peserta, dan promosi.',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center px-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 dark:bg-slate-800 flex items-center justify-center mb-5 text-primary-600 dark:text-primary-400">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
          ============================================================ */}
      {!isAuthenticated && (
        <section className="py-20">
          <div className="container-custom">
            <div className="rounded-3xl bg-primary-600 p-10 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Siap untuk membuat event Anda sendiri?
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                KumpulBareng menyediakan alat lengkap untuk mengelola event dari awal hingga akhir dengan mudah.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn-base bg-white text-primary-700 hover:bg-slate-50 px-8 py-3 font-bold">
                  Mulai Sekarang — Gratis
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
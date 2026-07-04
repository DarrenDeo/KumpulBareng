'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Users,
  TrendingUp,
  CalendarPlus,
  Clock,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { eventService } from '@/lib/api/services/event.service';
import { statsService } from '@/lib/api/services/stats.service';
import EventCard from '@/components/ui/EventCard';
import type { Event, UserStats } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [eventsRes, statsRes] = await Promise.allSettled([
          eventService.getMyEvents(),
          statsService.getUserStats(),
        ]);
        if (eventsRes.status === 'fulfilled') setMyEvents(eventsRes.value.data);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      } catch {}
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const STAT_CARDS = [
    { label: 'Event Dibuat', value: stats?.eventsCreated ?? 0, icon: CalendarDays, color: 'from-primary-500 to-violet-500' },
    { label: 'Event Diikuti', value: stats?.eventsJoined ?? 0, icon: Users, color: 'from-accent-500 to-emerald-400' },
    { label: 'Total Peserta', value: stats?.totalParticipantsInMyEvents ?? 0, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'Event Mendatang', value: stats?.upcomingEvents ?? 0, icon: Clock, color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Halo, <span className="text-primary-600 dark:text-primary-400">{user?.name || 'User'}</span>! 👋
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Selamat datang di dashboard kamu</p>
          </div>
          <Link href="/events/create" className="btn-primary">
            <CalendarPlus className="w-4 h-4" />
            Buat Event Baru
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* My Events */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Saya</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-0 overflow-hidden">
                <div className="h-40 skeleton rounded-b-none" />
                <div className="p-4 space-y-3">
                  <div className="h-5 skeleton w-3/4" />
                  <div className="h-4 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : myEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-12 text-center max-w-lg mx-auto">
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2">Belum ada event</h3>
            <p className="text-sm text-slate-500 mb-6">Mulai buat event pertama kamu!</p>
            <Link href="/events/create" className="btn-primary">
              <CalendarPlus className="w-4 h-4" />
              Buat Event
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
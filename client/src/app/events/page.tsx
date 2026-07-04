'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, CalendarDays } from 'lucide-react';
import { eventService } from '@/lib/api/services/event.service';
import EventCard from '@/components/ui/EventCard';
import { VALID_CATEGORIES } from '@/types';
import type { Event, PaginationMeta, EventFilters } from '@/types';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Terbaru' },
  { value: 'date', label: 'Tanggal Terdekat' },
  { value: 'title', label: 'Judul A-Z' },
];

function EventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 12,
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    priceType: (searchParams.get('priceType') as EventFilters['priceType']) || undefined,
    sort: (searchParams.get('sort') as EventFilters['sort']) || 'createdAt',
    upcoming: 'true',
  });

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await eventService.getEvents(filters);
      setEvents(res.data);
      setMeta(res.meta);
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilter = (key: keyof EventFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12, category: '', search: '', sort: 'createdAt', upcoming: 'true' });
  };

  const hasActiveFilters = filters.category || filters.search || filters.priceType;

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Jelajahi <span className="text-primary-600">Event</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Temukan event yang sesuai dengan minat kamu
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Cari event berdasarkan judul atau deskripsi..."
              className="input-base pl-10"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sort || 'createdAt'}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="input-base w-full sm:w-44"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Toggle Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn-secondary whitespace-nowrap',
              showFilters && 'border-primary-500 text-primary-600 dark:text-primary-400'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-500" />
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800"
          >
            {/* Categories */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-2 block">Kategori</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={cn(
                    'badge transition-colors cursor-pointer',
                    !filters.category
                      ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-300 dark:border-primary-500/30'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:border-slate-600'
                  )}
                >
                  Semua
                </button>
                {VALID_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={cn(
                      'badge transition-colors cursor-pointer',
                      filters.category === cat
                        ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-300 dark:border-primary-500/30'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:border-slate-600'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Type */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-2 block">Harga</span>
              <div className="flex gap-2">
                {[
                  { value: undefined, label: 'Semua' },
                  { value: 'gratis' as const, label: 'Gratis' },
                  { value: 'berbayar' as const, label: 'Berbayar' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => updateFilter('priceType', opt.value)}
                    className={cn(
                      'badge transition-colors cursor-pointer',
                      filters.priceType === opt.value
                        ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-300 dark:border-primary-500/30'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:border-slate-600'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-xs text-slate-500">
                <X className="w-3 h-3" />
                Hapus semua filter
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Results */}
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
        <>
          {/* Result count */}
          <p className="text-sm font-medium text-slate-500 mb-4">
            Menampilkan {events.length} dari {meta?.total || 0} event
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters((prev) => ({ ...prev, page }))}
                  className={cn(
                    'w-10 h-10 rounded-xl text-sm font-bold transition-all',
                    page === meta.page
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl p-16 text-center max-w-lg mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <CalendarDays className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2">
            Tidak ada event ditemukan
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {hasActiveFilters
              ? 'Coba ubah filter pencarian kamu'
              : 'Belum ada event yang tersedia saat ini'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-secondary">
              <X className="w-4 h-4" />
              Hapus Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn, formatDateShort, formatCurrency, getCapacityPercentage, daysFromNow, isEventPast } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/types';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const participantCount = event._count?.participants ?? event.participants?.length ?? 0;
  const capacity = getCapacityPercentage(participantCount, event.maxParticipants);
  const isPast = isEventPast(event.eventDate);
  const days = daysFromNow(event.eventDate);
  const categoryColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Lainnya'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="h-full"
    >
      <Link href={`/events/${event.id}`} className="block h-full group">
        <div className="glass-card-interactive h-full flex flex-col">
          {/* Category Graphic Banner */}
          <div className={cn(
            'relative h-36 bg-gradient-to-br overflow-hidden flex items-center justify-center',
            categoryColor.from, categoryColor.to
          )}>
            <div className="text-white opacity-90 scale-150 transform -rotate-12">
              {categoryColor.icon}
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/40 backdrop-blur-sm text-slate-800 dark:text-white text-xs font-bold shadow-sm">
                <span>{categoryColor.icon}</span>
                {event.category}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-3 right-3">
              <span className={cn(
                'px-2.5 py-1 rounded-md text-xs font-bold shadow-sm',
                event.price === 0
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/90 dark:bg-black/40 backdrop-blur-sm text-slate-800 dark:text-white'
              )}>
                {event.price === 0 
                  ? 'Gratis' 
                  : `${formatCurrency(Math.round(event.price / event.maxParticipants))} / org`}
              </span>
            </div>

            {/* Status / Countdown */}
            {isPast ? (
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-md">
                  Event Selesai
                </span>
              </div>
            ) : days <= 7 && days > 0 ? (
              <div className="absolute bottom-3 right-3">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-sm">
                  <Clock className="w-3 h-3" />
                  {days} hari lagi
                </span>
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-5 flex flex-col">
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {event.title}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{formatDateShort(event.eventDate)}</span>
              </div>
              <div className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Spacer to push capacity to bottom */}
            <div className="mt-auto" />

            {/* Capacity Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  {participantCount}/{event.maxParticipants} peserta
                </span>
                <span className={cn(
                  'text-[10px] font-bold',
                  capacity >= 90 ? 'text-red-500' : capacity >= 70 ? 'text-amber-500' : 'text-slate-500'
                )}>
                  {capacity}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={cn(
                    'progress-fill',
                    capacity >= 90 ? 'bg-red-500' : capacity >= 70 ? 'bg-amber-500' : 'bg-primary-500'
                  )}
                  style={{ width: `${capacity}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {event.author?.name ? event.author.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-xs font-medium text-slate-500 truncate max-w-[100px]">
                  {event.author?.name || 'Anonim'}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Detail
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

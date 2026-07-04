'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  Ticket,
  Clock,
  UserCircle,
  LogIn,
  Edit3,
  Trash2,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { eventService } from '@/lib/api/services/event.service';
import { paymentService } from '@/lib/api/services/stats.service';
import { useAuth } from '@/context/AuthContext';
import PaymentModal from '@/components/ui/PaymentModal';
import { cn, formatDate, formatTime, formatCurrency, getCapacityPercentage, isEventPast, daysFromNow } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/types';
import type { Event } from '@/types';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{ amount: number; orderId: string } | null>(null);

  const eventId = params.id as string;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(eventId);
        setEvent(res.data);
      } catch {
        toast.error('Event tidak ditemukan');
        router.push('/events');
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId, router]);

  if (isLoading || !event) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-56 skeleton rounded-2xl mb-6" />
          <div className="space-y-4">
            <div className="h-8 skeleton w-3/4" />
            <div className="h-4 skeleton w-1/2" />
            <div className="h-4 skeleton w-2/3" />
            <div className="h-32 skeleton mt-6" />
          </div>
        </div>
      </div>
    );
  }

  const participantCount = event._count?.participants ?? event.participants?.length ?? 0;
  const capacity = getCapacityPercentage(participantCount, event.maxParticipants);
  const isPast = isEventPast(event.eventDate);
  const days = daysFromNow(event.eventDate);
  const isOwner = user?.id === event.authorId || user?.id === event.author?.id;
  const isParticipant = event.participants?.some((p) => p.id === user?.id) ?? false;
  const isFull = participantCount >= event.maxParticipants;
  const categoryColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Lainnya'];

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    setActionLoading('join');
    try {
      if (event.price > 0) {
        // Paid event: create transaction and show modal
        const txRes = await paymentService.createTransaction(eventId);
        const orderId = txRes.data.transaction?.orderId || txRes.data.paymentInfo?.orderId;
        const amount = txRes.data.transaction?.amount || txRes.data.paymentInfo?.amount || Math.round(event.price / event.maxParticipants);
        
        if (orderId) {
          setPaymentData({ amount, orderId });
          setIsPaymentModalOpen(true);
        }
      } else {
        // Free event: direct join
        await eventService.joinEvent(eventId);
        toast.success('Berhasil bergabung ke event!');
        
        // Refresh event data
        const res = await eventService.getEventById(eventId);
        setEvent(res.data);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal bergabung ke event');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!paymentData) return;
    try {
      await paymentService.simulateSuccess(paymentData.orderId);
      toast.success('Pembayaran berhasil! Anda terdaftar sebagai peserta.');
      setIsPaymentModalOpen(false);
      
      // Refresh event data
      const res = await eventService.getEventById(eventId);
      setEvent(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal memverifikasi pembayaran');
    }
  };

  const handleLeave = async () => {
    setActionLoading('leave');
    try {
      await eventService.leaveEvent(eventId);
      toast.success('Berhasil keluar dari event');
      const res = await eventService.getEventById(eventId);
      setEvent(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal keluar dari event');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus event ini? Tindakan ini tidak bisa dibatalkan.')) return;
    setActionLoading('delete');
    try {
      await eventService.deleteEvent(eventId);
      toast.success('Event berhasil dihapus');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus event');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <button onClick={() => router.back()} className="btn-ghost text-slate-500 -ml-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Banner */}
          <div className={cn(
            'relative h-48 md:h-64 rounded-2xl overflow-hidden flex items-center justify-center mb-8',
            categoryColor.from, categoryColor.to,
            'bg-gradient-to-br'
          )}>
            <div className="text-white opacity-90 scale-[3] transform -rotate-12">
              {categoryColor.icon}
            </div>
            {/* Badges */}
            <div className="absolute top-4 left-4">
              <span className="badge bg-white/90 dark:bg-black/40 backdrop-blur-sm text-slate-800 dark:text-white border-transparent text-sm font-bold shadow-sm">
                {event.category}
              </span>
            </div>
            {isPast && (
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold shadow-lg">
                  Event Telah Selesai
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Price */}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={cn(
                    'badge-primary text-sm shadow-sm',
                    event.price === 0 && 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                  )}>
                    <Ticket className="w-4 h-4" />
                    {event.price === 0 ? 'Gratis' : `${formatCurrency(Math.round(event.price / event.maxParticipants))} / orang`}
                  </span>
                  {!isPast && days <= 7 && days > 0 && (
                    <span className="badge-warning text-sm shadow-sm">
                      <Clock className="w-4 h-4" />
                      {days} hari lagi
                    </span>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(event.eventDate)}</p>
                    <p className="text-xs font-medium text-slate-500">{formatTime(event.eventDate)} WIB</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Dibuat oleh {event.author?.name || 'Anonim'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card p-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Deskripsi Event</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* Participants */}
              {event.participants && event.participants.length > 0 && (
                <div className="glass-card p-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Peserta ({participantCount})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {event.participants.map((p) => (
                      <span key={p.id} className="badge bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                        <UserCircle className="w-3 h-3" />
                        {p.name || 'Anonim'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Capacity Card */}
              <div className="glass-card p-5 sticky top-24">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Kapasitas Peserta</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{participantCount}</span>
                  <span className="text-sm font-medium text-slate-500 mb-1">/ {event.maxParticipants}</span>
                </div>
                <div className="progress-bar mb-4">
                  <div
                    className={cn('progress-fill', capacity >= 90 ? 'bg-red-500' : capacity >= 70 ? 'bg-amber-500' : 'bg-primary-600 dark:bg-primary-500')}
                    style={{ width: `${capacity}%` }}
                  />
                </div>

                {/* Action Button */}
                {isPast ? (
                  <div className="text-center py-3 text-sm font-medium text-slate-500">
                    Event ini sudah selesai
                  </div>
                ) : isOwner ? (
                  <div className="space-y-2">
                    <Link href={`/events/${eventId}/edit`} className="btn-secondary w-full justify-center">
                      <Edit3 className="w-4 h-4" />
                      Edit Event
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={actionLoading === 'delete'}
                      className="btn-danger w-full justify-center"
                    >
                      {actionLoading === 'delete' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Hapus Event
                    </button>
                  </div>
                ) : isParticipant ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Kamu sudah terdaftar
                    </div>
                    <button
                      onClick={handleLeave}
                      disabled={actionLoading === 'leave'}
                      className="btn-danger w-full justify-center"
                    >
                      {actionLoading === 'leave' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Batal Ikut Event
                    </button>
                  </div>
                ) : !isAuthenticated ? (
                  <Link href="/login" className="btn-primary w-full justify-center btn-lg">
                    <LogIn className="w-4 h-4" />
                    Masuk untuk Bergabung
                  </Link>
                ) : isFull ? (
                  <div className="text-center py-3 text-sm font-bold text-red-600 bg-red-50 rounded-lg border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                    Event sudah penuh
                  </div>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading === 'join'}
                    className={cn(
                      'w-full justify-center btn-lg',
                      event.price > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'btn-primary'
                    )}
                  >
                    {actionLoading === 'join' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : event.price > 0 ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Bayar & Bergabung
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        Gabung Gratis
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {paymentData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          amount={paymentData.amount}
          orderId={paymentData.orderId}
        />
      )}
    </div>
  );
}
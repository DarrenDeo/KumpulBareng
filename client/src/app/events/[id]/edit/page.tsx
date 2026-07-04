'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Edit3,
  MapPin,
  Calendar,
  Type,
  FileText,
  Tag,
  Users,
  Ticket,
  ArrowLeft,
  Loader2,
  Save,
} from 'lucide-react';
import { eventService } from '@/lib/api/services/event.service';
import { useAuth } from '@/context/AuthContext';
import { VALID_CATEGORIES } from '@/types';
import type { Event } from '@/types';
import toast from 'react-hot-toast';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventId = params.id as string;

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    eventDate: '',
    price: 0,
    maxParticipants: 10,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(eventId);
        const event = res.data;
        // Check ownership
        if (user && event.authorId !== user.id && event.author?.id !== user.id) {
          toast.error('Anda tidak memiliki izin untuk mengedit event ini');
          router.push(`/events/${eventId}`);
          return;
        }
        // Format datetime-local value
        const dateObj = new Date(event.eventDate);
        const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);

        setForm({
          title: event.title,
          description: event.description,
          category: event.category,
          location: event.location,
          eventDate: localDate,
          price: event.price,
          maxParticipants: event.maxParticipants,
        });
      } catch {
        toast.error('Event tidak ditemukan');
        router.push('/dashboard');
      } finally {
        setIsLoadingEvent(false);
      }
    };

    if (isAuthenticated && eventId) fetchEvent();
  }, [eventId, isAuthenticated, authLoading, user, router]);

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        eventDate: new Date(form.eventDate).toISOString(),
        price: Number(form.price),
        maxParticipants: Number(form.maxParticipants),
      };
      await eventService.updateEvent(eventId, payload);
      toast.success('Event berhasil diperbarui!');
      router.push(`/events/${eventId}`);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors?.length) {
        const fieldErrors: Record<string, string> = {};
        data.errors.forEach((e: { field: string; message: string }) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(data?.message || 'Gagal memperbarui event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent || authLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const inputClass = (field: string) =>
    `input-base ${errors[field] ? 'input-error' : ''}`;

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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Event</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-[60px]">
            Perbarui detail event kamu
          </p>
        </div>

        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="edit-title" className="input-label">Judul Event</label>
              <div className="relative">
                <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input id="edit-title" type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className={`${inputClass('title')} pl-10`} required />
              </div>
              {errors.title && <p className="input-error-text">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="edit-desc" className="input-label">Deskripsi</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <textarea id="edit-desc" value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} className={`${inputClass('description')} pl-10 resize-none`} required />
              </div>
              {errors.description && <p className="input-error-text">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-cat" className="input-label">Kategori</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select id="edit-cat" value={form.category} onChange={(e) => updateField('category', e.target.value)} className={`${inputClass('category')} pl-10 appearance-none bg-white dark:bg-slate-800`} required>
                    <option value="">Pilih kategori</option>
                    {VALID_CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                {errors.category && <p className="input-error-text">{errors.category}</p>}
              </div>
              <div>
                <label htmlFor="edit-loc" className="input-label">Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="edit-loc" type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} className={`${inputClass('location')} pl-10`} required />
                </div>
                {errors.location && <p className="input-error-text">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="edit-date" className="input-label">Tanggal & Waktu</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input id="edit-date" type="datetime-local" value={form.eventDate} onChange={(e) => updateField('eventDate', e.target.value)} className={`${inputClass('eventDate')} pl-10`} required />
              </div>
              {errors.eventDate && <p className="input-error-text">{errors.eventDate}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-price" className="input-label">Harga Total Event (Rp)</label>
                <div className="relative">
                  <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="edit-price" type="number" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} className={`${inputClass('price')} pl-10`} required />
                </div>
                {errors.price && <p className="input-error-text">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="edit-cap" className="input-label">Kapasitas Peserta</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="edit-cap" type="number" min="1" max="10000" value={form.maxParticipants} onChange={(e) => updateField('maxParticipants', e.target.value)} className={`${inputClass('maxParticipants')} pl-10`} required />
                </div>
                {errors.maxParticipants && <p className="input-error-text">{errors.maxParticipants}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center btn-lg">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
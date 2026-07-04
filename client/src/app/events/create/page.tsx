'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CalendarPlus,
  MapPin,
  Calendar,
  Type,
  FileText,
  Tag,
  Users,
  Ticket,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { eventService } from '@/lib/api/services/event.service';
import { useAuth } from '@/context/AuthContext';
import { VALID_CATEGORIES } from '@/types';
import toast from 'react-hot-toast';

export default function CreateEventPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    eventDate: '',
    price: 0,
    maxParticipants: 10,
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

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
      const res = await eventService.createEvent(payload);
      toast.success('Event berhasil dibuat! 🎉');
      router.push(`/events/${res.data.id}`);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors?.length) {
        const fieldErrors: Record<string, string> = {};
        data.errors.forEach((e: { field: string; message: string }) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(data?.message || 'Gagal membuat event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Back */}
        <button onClick={() => router.back()} className="btn-ghost text-slate-500 -ml-4 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Buat Event Baru</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-[60px]">
            Isi detail event kamu dan mulai kumpul bareng!
          </p>
        </div>

        {/* Form */}
        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="input-label">Judul Event</label>
              <div className="relative">
                <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input id="title" type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Contoh: Futsal Bareng Weekend" className={`${inputClass('title')} pl-10`} required />
              </div>
              {errors.title && <p className="input-error-text">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="input-label">Deskripsi</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <textarea id="description" value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Jelaskan detail event kamu..." rows={4} className={`${inputClass('description')} pl-10 resize-none`} required />
              </div>
              {errors.description && <p className="input-error-text">{errors.description}</p>}
            </div>

            {/* Category & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="input-label">Kategori</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select id="category" value={form.category} onChange={(e) => updateField('category', e.target.value)} className={`${inputClass('category')} pl-10 appearance-none bg-white dark:bg-slate-800`} required>
                    <option value="">Pilih kategori</option>
                    {VALID_CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                {errors.category && <p className="input-error-text">{errors.category}</p>}
              </div>
              <div>
                <label htmlFor="location" className="input-label">Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="location" type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Contoh: Jakarta Selatan" className={`${inputClass('location')} pl-10`} required />
                </div>
                {errors.location && <p className="input-error-text">{errors.location}</p>}
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="eventDate" className="input-label">Tanggal & Waktu</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input id="eventDate" type="datetime-local" value={form.eventDate} onChange={(e) => updateField('eventDate', e.target.value)} className={`${inputClass('eventDate')} pl-10`} required />
              </div>
              {errors.eventDate && <p className="input-error-text">{errors.eventDate}</p>}
            </div>

            {/* Price & Capacity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="input-label">Harga Total Event (Rp)</label>
                <div className="relative">
                  <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="price" type="number" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0 = Gratis" className={`${inputClass('price')} pl-10`} required />
                </div>
                <p className="input-helper-text">Masukkan 0 untuk event gratis</p>
                {errors.price && <p className="input-error-text">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="maxParticipants" className="input-label">Kapasitas Peserta</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input id="maxParticipants" type="number" min="1" max="10000" value={form.maxParticipants} onChange={(e) => updateField('maxParticipants', e.target.value)} className={`${inputClass('maxParticipants')} pl-10`} required />
                </div>
                {errors.maxParticipants && <p className="input-error-text">{errors.maxParticipants}</p>}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center btn-lg">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CalendarPlus className="w-5 h-5" />
                    Buat Event
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

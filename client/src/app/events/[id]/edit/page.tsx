'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // State untuk form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [price, setPrice] = useState<number | ''>(''); // <-- TAMBAHKAN
  const [maxParticipants, setMaxParticipants] = useState<number | ''>(''); // <-- TAMBAHKAN
  const [loading, setLoading] = useState(true);

  // Ambil data Events yang ada untuk mengisi form
  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`);
          const event = response.data;
          setTitle(event.title);
          setDescription(event.description);
          setCategory(event.category);
          setLocation(event.location);
          setPrice(event.price); // <-- TAMBAHKAN
          setMaxParticipants(event.maxParticipants); // <-- TAMBAHKAN
          
          const date = new Date(event.eventDate);
          const timezoneOffset = date.getTimezoneOffset() * 60000;
          const localDate = new Date(date.getTime() - timezoneOffset);
          const formattedDate = localDate.toISOString().slice(0, 16);
          setEventDate(formattedDate);

        } catch (err) {
          toast.error('Gagal memuat data Events.');
        } finally {
          setLoading(false);
        }
      };
      fetchEventData();
    }
  }, [id]);

  // Fungsi untuk mengirim update
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
        { title, description, category, location, eventDate, price, maxParticipants }, // <-- TAMBAHKAN
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Events berhasil diperbarui!');
      router.push(`/events/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui Events.'); // <-- GANTI DENGAN TOAST
    }
  };

  if (loading) return <p className="text-center">Memuat data...</p>;

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center">Edit Events</h1>
      <form className="space-y-6" onSubmit={handleUpdateEvent}>
        <Input label="Judul Events" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Deskripsi" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Input label="Kategori" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <Input label="Lokasi" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <Input label="Tanggal & Waktu Events" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />

        {/* --- TAMBAHKAN DUA INPUT INI --- */}
        <Input 
          label="Total Biaya (Rp)" 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          required 
        />
        <Input 
          label="Kapasitas Maksimal Peserta" 
          type="number" 
          value={maxParticipants} 
          onChange={(e) => setMaxParticipants(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          required 
        />
        {/* ----------------------------- */}

        <Button type="submit">Simpan Perubahan</Button>
        <Link href={`/events/${id}`} className="block text-center text-sm text-blue-500 hover:underline mt-4">
          Batal
        </Link>
      </form>
    </div>
  );
}
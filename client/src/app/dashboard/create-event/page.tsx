'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Autentikasi gagal. Silakan login kembali.');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        { title, description, category, location, eventDate, price, maxParticipants },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Events berhasil dibuat! Anda akan diarahkan ke Dashboard.');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat Events.');
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center">Buat Events Baru</h1>
        <form className="space-y-6" onSubmit={handleCreateEvent}>
          <Input label="Judul Events" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Deskripsi" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <Input label="Kategori" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <Input label="Lokasi" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <Input label="Tanggal & Waktu Events" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
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
          
          <Button type="submit">Buat Events</Button>
          <Link href="/dashboard" className="block text-center text-sm text-blue-500 hover:underline mt-4">
            Batal
          </Link>
        </form>
      </div>
    </div>
  );
}
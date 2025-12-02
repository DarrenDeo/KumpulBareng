'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Button from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

// Deklarasikan 'snap' di scope global
declare global {
  interface Window {
    snap: any;
  }
}

// Definisikan tipe data
interface User {
  id: string;
  name: string;
}
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  authorId: string; // Wajib ada untuk perbandingan
  author: { name: string };
  participants: User[];
  price: number;
  maxParticipants: number;
}
interface DecodedToken {
  id: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setCurrentUser(jwtDecode(token));
    }

    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`);
          setEvent(response.data);
        } catch (err) {
          setError('Gagal memuat detail acara.');
          toast.error('Gagal memuat detail acara.');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus acara ini?')) {
      try {
        const token = localStorage.getItem('userToken');
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Acara berhasil dihapus!');
        router.push('/events');
      } catch (err) {
        toast.error('Gagal menghapus acara.');
      }
    }
  };

  const handleJoin = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Anda harus login untuk ikut acara.');
      return;
    }

    if (event && event.price > 0) {
      try {
        toast.loading('Membuat transaksi...');
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-transaction`,
          { eventId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.dismiss();
        const transactionToken = response.data.token;

        window.snap.pay(transactionToken, {
          onSuccess: function(result: any){
            toast.success("Pembayaran berhasil! Anda telah bergabung.");
            setTimeout(() => window.location.reload(), 1500);
          },
          onPending: function(result: any){
            toast("Menunggu pembayaran Anda.");
          },
          onError: function(result: any){
            toast.error("Pembayaran gagal.");
          },
        });
      } catch (err) {
        toast.dismiss();
        toast.error('Gagal membuat transaksi.');
      }
    } else {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/join`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Anda berhasil bergabung!');
        window.location.reload();
      } catch (err) {
        toast.error('Gagal bergabung dengan acara.');
      }
    }
  };

  const handleLeave = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    if (window.confirm('Apakah Anda yakin ingin batal ikut acara ini?')) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/leave`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Anda telah batal ikut.');
        window.location.reload();
      } catch (err) {
        toast.error('Gagal batal ikut acara.');
      }
    }
  }

  if (loading) return <p className="text-center mt-10">Memuat acara...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!event) return <p className="text-center mt-10">Acara tidak ditemukan.</p>;

  // Hitung ulang setiap kali render untuk memastikan data terbaru
  const isOwner = currentUser?.id === event.authorId;
  const hasJoined = event.participants.some(p => p.id === currentUser?.id);
  const pricePerPerson = event.maxParticipants > 0 ? event.price / event.maxParticipants : 0;

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Kolom Kiri: Detail Acara */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md relative">
        {/* Tombol Edit & Hapus */}
        {isOwner && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href={`/events/${id}/edit`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm no-underline flex items-center">
              Edit
            </Link>
            <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
              Hapus
            </button>
          </div>
        )}

        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-900 mb-4">
          {event.category}
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{event.title}</h1>
        <div className="text-md text-gray-500 dark:text-gray-400 mb-6">
          <p>Diselenggarakan oleh: <strong>{event.author.name}</strong></p>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{event.description}</p>
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-6 space-y-4">
          <div className="flex items-center"><span className="w-24 font-semibold">📍 Lokasi</span><span>{event.location}</span></div>
          <div className="flex items-center"><span className="w-24 font-semibold">🗓️ Waktu</span><span>{new Date(event.eventDate).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</span></div>
        </div>
        <div className="mt-8">
          {event.price > 0 && <p className="text-2xl font-bold mb-4">Harga per orang: Rp {pricePerPerson.toLocaleString('id-ID')}</p>}
          
          {hasJoined ? (
            <Button onClick={handleLeave} className="bg-red-500 hover:bg-red-600">
              Batalkan Keikutsertaan
            </Button>
          ) : (
            <Button onClick={handleJoin}>
              {event.price > 0 ? 'Ikut & Bayar' : 'Ikut Acara (Gratis)'}
            </Button>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Daftar Peserta */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 h-fit">
        <h2 className="text-2xl font-bold mb-4">Peserta ({event.participants.length} / {event.maxParticipants})</h2>
        <ul className="space-y-3">
          {event.participants.map(participant => (
            <li key={participant.id} className="flex items-center gap-3">
              <span className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center font-bold">{participant.name.charAt(0).toUpperCase()}</span>
              <span>{participant.name}</span>
            </li>
          ))}
          {event.participants.length === 0 && <p className="text-gray-500">Jadilah yang pertama ikut!</p>}
        </ul>
      </div>
    </div>
  );
}
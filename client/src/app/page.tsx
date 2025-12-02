'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Definisikan tipe data
interface Event {
  id: string;
  title: string;
  category: string;
}

export default function HomePage() {
  const [latestEvents, setLatestEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Ambil 3 Events terbaru
    const fetchLatestEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events?limit=3');
        setLatestEvents(response.data);
      } catch (error) {
        console.error('Gagal mengambil Events terbaru:', error);
      }
    };

    fetchLatestEvents();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Temukan Teman untuk Aktivitas Favoritmu
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Jangan biarkan rencanamu hanya menjadi wacana. Buat Events, cari teman baru, dan wujudkan kegiatan seru bersama di KumpulBareng.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/events" className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            Lihat Semua Events
          </Link>
          <Link href="/register" className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full transform transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-700 dark:text-white">
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Events Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestEvents.length > 0 ? (
              latestEvents.map(event => (
                <Link href={`/events/${event.id}`} key={event.id} className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border dark:border-gray-700">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-900">{event.category}</span>
                  <h3 className="text-xl font-semibold mt-4 dark:text-white">{event.title}</h3>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">Memuat Events terbaru...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
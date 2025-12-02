'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SkeletonCard from '@/components/ui/SkeletonCard';

// Definisikan tipe data untuk sebuah Events
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  author: {
    name: string;
  };
}

export default function EventsPage() {
  // === State Management ===
  const [events, setEvents] = useState<Event[]>([]); // Data asli dari API
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]); // Data yang akan ditampilkan
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // === Data Fetching ===
  // Mengambil data Events dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
        setEvents(response.data);
        setFilteredEvents(response.data); // Set data awal untuk ditampilkan
      } catch (err) {
        setError('Gagal memuat Events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Array dependensi kosong, hanya berjalan sekali

  // === Filtering Logic ===
  // Berjalan setiap kali ada perubahan pada data asli, kata kunci pencarian, atau kategori
  useEffect(() => {
    let result = events;

    // 1. Filter berdasarkan kategori
    if (selectedCategory !== 'Semua') {
      result = result.filter(event => event.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 2. Filter berdasarkan pencarian
    if (searchTerm) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, events]);

  // === Render Component ===
  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-center mb-8">Daftar Events</h1>
        {/* Placeholder untuk UI Filter & Search */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        {/* Grid untuk Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Daftar kategori (bisa juga diambil dari database nantinya)
  const categories = ['Semua', 'Olahraga', 'Film', 'Musik', 'Game'];

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Daftar Events</h1>
      
      {/* UI untuk Filter dan Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari berdasarkan judul atau deskripsi..."
          className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div> 
      {/* Grid untuk menampilkan Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full border dark:border-gray-700 flex flex-col">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-900">
                  {event.category}
                </span>
                <h2 className="text-xl font-bold mt-4 mb-2">{event.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{event.description}</p>
                <div className="text-sm text-gray-500 dark:text-gray-300 border-t dark:border-gray-700 pt-4 mt-4">
                  <p><strong>Lokasi:</strong> {event.location}</p>
                  <p><strong>Waktu:</strong> {new Date(event.eventDate).toLocaleString('id-ID')}</p>
                  <p><strong>Dibuat oleh:</strong> {event.author.name}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">Tidak ada Events yang cocok dengan kriteria Anda.</p>
        )}
      </div>
    </div>
  );
}
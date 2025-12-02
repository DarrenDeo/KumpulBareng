'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';

// Definisikan tipe data untuk pengguna
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('${process.env.NEXT_PUBLIC_API_URL}/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Gagal mengambil profil pengguna:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return <p className="text-center">Memuat profil...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Profil Saya</h1>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{user.email}</p>
              </div>
              <div className="pt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Edit Profil (Segera Hadir)
                </button>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Gagal memuat data profil.</p>
          )}
        </div>
      </div>
    </div>
  );
}
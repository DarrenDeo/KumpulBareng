'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/layout/Sidebar';
import StatsChart from '@/components/features/StatsChart';

// Definisikan tipe untuk data statistik
interface StatsData {
  eventsCreated: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      }
    };
    fetchStats();
  }, [router]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <Sidebar />
      <div className="flex-1 space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {/* Beri wadah dengan tinggi yang pasti untuk menstabilkan chart */}
          <div className="relative h-96"> 
            {stats ? <StatsChart stats={stats} /> : <p>Memuat statistik...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
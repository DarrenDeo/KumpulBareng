'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Definisikan tipe untuk props yang diterima
interface StatsChartProps {
  stats: {
    eventsCreated: number;
    // Tambahkan statistik lain di sini jika ada
  };
}

export default function StatsChart({ stats }: StatsChartProps) {
  const data = {
    labels: ['Events Dibuat'],
    datasets: [
      {
        label: 'Statistik Anda',
        // Gunakan data asli dari props
        data: [stats.eventsCreated],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Tambahkan ini agar chart mengisi kontainer
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Aktivitas Anda',
      },
    },
  };

  return <Bar options={options} data={data} />;
}
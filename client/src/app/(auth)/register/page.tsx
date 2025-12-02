// 'use client' wajib ada karena kita menggunakan state (useState)
'use client'; 

import React, { useState } from 'react';
import axios from 'axios';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Hapus state lama agar tidak tampil bersamaan dengan toast
    setError('');
    setSuccess('');

    try {
      // Kirim data ke backend di port 5000
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        name,
        email,
        password,
      });

      // Ganti setSuccess dengan toast.success
      toast.success('Registrasi berhasil! Silakan login.');
      
      setName('');
      setEmail('');
      setPassword('');

    } catch (err: any) {
      // Ganti setError dengan toast.error
      toast.error(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Buat Akun Baru
      </h1>
      <form className="space-y-6" onSubmit={handleRegister}>
        <Input
          id="name"
          label="Nama Lengkap"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Alamat Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <Button type="submit">
          Register
        </Button>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
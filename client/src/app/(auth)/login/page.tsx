'use client'; 

import React, { useState } from 'react';
import axios from 'axios';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        email,
        password,
      });
      
      // 1. Simpan token ke localStorage browser
      localStorage.setItem('userToken', response.data.token);
      
      // 2. Beri notifikasi
      toast.success('Login berhasil!');
      
      // 3. Arahkan pengguna ke halaman dashboard
      window.location.href = '/dashboard';

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login ke Akun Anda</h1>
      <form className="space-y-6" onSubmit={handleLogin}>
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
        <Button type="submit">
          Login
        </Button>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
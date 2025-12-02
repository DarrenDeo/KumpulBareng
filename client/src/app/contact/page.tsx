'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Mengirim...');
    // Logika pengiriman form akan ditambahkan di sini nanti
    // Untuk sekarang, kita hanya simulasi
    setTimeout(() => {
      setStatus('Pesan Anda telah terkirim! Terima kasih.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Hubungi Kami
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Punya pertanyaan atau masukan? Kami siap mendengar dari Anda.
        </p>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Kolom Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Nama Anda" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email Anda" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pesan</label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <Button type="submit">Kirim</Button>
              {status && <p className="text-sm mt-4">{status}</p>}
            </form>
          </div>

          {/* Kolom Info Kontak */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Info Kontak</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Anda juga bisa menghubungi kami melalui email atau media sosial kami.
            </p>
            <div>
              <h3 className="font-semibold dark:text-white">Email</h3>
              <a href="mailto:info@kumpulbareng.com" className="text-blue-500 hover:underline">info@kumpulbareng.com</a>
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">Media Sosial</h3>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-gray-500 hover:text-blue-500">Twitter</a>
                <a href="#" className="text-gray-500 hover:text-blue-500">Instagram</a>
                <a href="#" className="text-gray-500 hover:text-blue-500">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
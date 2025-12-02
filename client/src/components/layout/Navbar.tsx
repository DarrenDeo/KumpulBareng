'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const ThemeToggleButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true) }, []);

  if (!mounted) return <div style={{ width: '36px', height: '36px' }} />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = (
    <>
      <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors block py-2 md:py-0" onClick={() => setIsMenuOpen(false)}>Home</Link>
      <Link href="/events" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors block py-2 md:py-0" onClick={() => setIsMenuOpen(false)}>Events</Link>
      {isLoggedIn ? (
        <>
          <Link href="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors block py-2 md:py-0" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          <button onClick={handleLogout} className="w-full text-left md:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</button>
        </>
      ) : (
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors block" onClick={() => setIsMenuOpen(false)}>Login</Link>
      )}
    </>
  );

  return (
    <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${hasScrolled ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-transparent dark:text-white'}`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          KumpulBareng
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          {navLinks}
          <ThemeToggleButton />
        </div>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggleButton />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden px-6 pt-2 pb-4 flex flex-col space-y-2 bg-white dark:bg-gray-800">
          {navLinks}
        </div>
      )}
    </nav>
  );
}
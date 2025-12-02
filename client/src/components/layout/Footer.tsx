import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {currentYear} KumpulBareng. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            Tentang Kami
          </Link>
          <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
}
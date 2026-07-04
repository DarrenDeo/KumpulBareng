import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Jelajahi',
    links: [
      { label: 'Semua Event', href: '/events' },
      { label: 'Kategori', href: '/events?sort=date' },
      { label: 'Event Gratis', href: '/events?priceType=gratis' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Tentang Kami', href: '/about' },
      { label: 'Hubungi Kami', href: '/contact' },
      { label: 'Buat Event', href: '/events/create' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-auto transition-colors">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Kumpul<span className="text-primary-600">Bareng</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Platform komunitas & event terbaik untuk menemukan teman baru,
              berbagi pengalaman, dan kumpul bareng di seluruh Indonesia.
            </p>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="divider mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} KumpulBareng. Semua hak dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
            Dibuat dengan <Heart className="w-3 h-3 text-red-500" /> di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
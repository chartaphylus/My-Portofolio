'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    // Send notification to Telegram about 404
    const notify404 = async () => {
      try {
        const path = window.location.pathname;
        await fetch('/api/seo/monitoring', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: '404_DETECTED',
            path: path,
            userAgent: navigator.userAgent
          })
        });
      } catch (err) {
        console.error('Failed to notify 404:', err);
      }
    };

    notify404();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] text-[var(--theme-text)] px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[var(--theme-primary)] opacity-20">404</h1>
        <div className="-mt-20 relative z-10">
          <h2 className="text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-[var(--theme-text)]/60 mb-8 max-w-md mx-auto">
            Maaf, sepertinya Anda tersesat di dimensi lain. Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[var(--theme-primary)] text-white rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

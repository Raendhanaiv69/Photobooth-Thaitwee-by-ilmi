// File: ../components/Header.js

import React from 'react';
import Link from 'next/link'; // 1. Import Link untuk navigasi cepat
import Image from 'next/image'; // 2. Import Image untuk optimasi gambar

const LOGO_URL = "/images/logo.png";
const LOGO_ALT = "ThaiTwee Snap Logo";

export default function Header() {
  return (
    <div className="bg-pink-400 shadow-sm">
      <div className="flex justify-center items-center py-2 sm:py-0">
        
        {/*
          Mengganti <a> dengan <Link> untuk navigasi internal yang cepat.
          Note: Di Next.js 13+, tag <a> tidak lagi perlu menjadi child dari <Link>.
        */}
        <Link href="/" passHref>
          <Image
            src={LOGO_URL}
            alt={LOGO_ALT}
            // Properti width dan height WAJIB untuk Image dari next/image
            // Ganti nilai ini dengan dimensi sebenarnya dari logo Anda untuk mencegah CLS (Cumulative Layout Shift)
            width={120} // Contoh: lebar 120px
            height={80} // Contoh: tinggi 80px
            className="sm:h-20 w-auto" // Tailwind styling masih dapat diterapkan
            priority={true} // Opsional: Beri tahu Next.js bahwa gambar ini penting
          />
        </Link>
        
      </div>
    </div>
  );
}
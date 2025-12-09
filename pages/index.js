import React from 'react';
import { useRouter } from 'next/router'; 
// Asumsi Anda menggunakan Next.js karena ada 'next/router'

// --- PENTING: Import komponen Header di sini ---
import Header from '../components/Header'; // Sesuaikan path ini jika perlu

const LandingPage = () => {
    const router = useRouter();
    
    // URL gambar untuk header (Ganti dengan URL gambar photobooth Anda)
    const HEADER_IMAGE_URL = "/images/Header1.png"; 

    return (
        <>
            {/* Tempatkan Header di sini */}
            <Header />

            <main className="min-h-screen bg-white flex flex-col items-center text-center px-4 py-16">
                
                {/* Header Gambar Photobooth */}
                <div className="w-full max-w-2xl sm:max-w-4xl h-48 sm:h-64 mb-10 overflow-hidden rounded-lg shadow-xl">
                    <img 
                        src={HEADER_IMAGE_URL} 
                        alt="Photobooth setup with film strips and photos" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Kontainer Judul Utama */}
                <div className="mb-10 w-full max-w-lg">
                    <h1 className="text-gray-800 font-bold text-5xl sm:text-6xl md:text-7xl">
                        Photobooth Online
                    </h1>
                    <p className="text-gray-600 text-lg sm:text-xl md:text-2xl mt-4">
                        take your photo with your favorite actor&apos;s character
                    </p>
                </div>

                {/* Tombol Mulai (Warna Pink/Soft) */}
                <button
                    onClick={() => router.push('/framefixs')}
                    className="
                        mt-6 
                        bg-pink-400 hover:bg-gray-200
                        text-gray-800 font-bold 
                        py-4 px-16 sm:py-5 sm:px-20 
                        rounded-full 
                        text-xl sm:text-2xl
                        shadow-lg transition duration-300 transform hover:scale-[1.03]
                        w-full max-w-md
                    "
                   
                >
                    Let&apos;s Go Start
                </button>
                
            </main>
        </>
    );
};

export default LandingPage;
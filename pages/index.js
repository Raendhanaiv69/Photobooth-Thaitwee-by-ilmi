import Header from '../components/Header';
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>PhotoBooth Online</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-sky-100 flex flex-col items-center text-center px-4 py-16">
        
        {/* Kontainer Judul Utama */}
        <div className="mb-10">
          <div className="text-pink-400 text-6xl mb-2">
            📷
          </div>
          <h1 className="text-pink-600 font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Photobooth Online
          </h1>
          <p className="text-purple-400 text-md sm:text-lg md:text-xl mt-2">
            take your photo with your favorite actor's character
          </p>
        </div>

        {/* Tombol Mulai */}
        <button
          onClick={() => router.push('/select-frame')}
          className="mt-6 bg-yellow-200 hover:bg-yellow-300 text-pink-600 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          Let&apos;s Go Start
        </button>

        
      </main>
    </>
  );
}
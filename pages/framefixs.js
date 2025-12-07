"use client";
import Header from '/components/Header';
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// Frame + layout terkait (simulasi dari admin)
const frameOptions = [
  {
    id: 1,
    label: "Cute Pink Strip",
    src: "/images/frames/NANI.png",
    preview: "/images/frames/NANI1.png",
    layoutId: 1, // Sesuai dengan layout 1
  },
  {
    id: 2,
    label: "Romantic Soft Pink",
    src: "/images/frames/Look.png",
    preview: "/images/frames/Look.png",
    layoutId: 2, // Layout 2
  },
  {
    id: 3,
    label: "Kawaii Grid",
    src: "/images/frames/Jaidee-frame.png",
    preview: "/images/frames/Jaidee-frame.png",
    layoutId: 3, // Layout 3
  },
  // Tambahkan frame lain dengan layoutId masing-masing
];

const ChooseFrame = () => {
  const router = useRouter();

  const handleSelect = (frame) => {
    router.push({
      pathname: "/camera",
      query: {
        frame: frame.src,
        layoutId: frame.layoutId, // kirim layoutId ke halaman kamera
      },
    });
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <Header />

      <main className="flex flex-col items-center text-center px-4 py-10">
        <h1 className="text-4xl font-bold text-pink-500 mb-10">
          🎀 Pilih Frame Photobooth Kamu!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 justify-items-center">
          {frameOptions.map((frame) => (
            <div
              key={frame.id}
              onClick={() => handleSelect(frame)}
              className="cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="relative w-50 h-[480px] bg-white rounded-xl shadow-md overflow-hidden ring-yellow-300">
                <Image
                  src={frame.preview}
                  alt={frame.label}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-gray-700">
                {frame.label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Setelah memilih frame, kamu akan diarahkan ke kamera untuk mulai foto.
        </p>
      </main>
    </div>
  );
};

export default ChooseFrame;
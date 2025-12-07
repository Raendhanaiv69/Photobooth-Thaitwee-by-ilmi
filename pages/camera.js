import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

// Definisi Layout Dasar (Layout 1)
const baseLayout = {
  photoSlots: 3,
  positions: [
    { top: 40, left: 15, width: 240, height: 160 },
    { top: 220, left: 15, width: 240, height: 160 },
    { top: 400, left: 15, width: 240, height: 160 },
  ],
  canvasSize: { width: 270, height: 680 },
};

// Semua layout predefined diubah agar sama dengan Layout Dasar (3 Foto)
const layouts = {
  "1": {
    name: "2x6 - 3 Photo (Standard)",
    ...baseLayout,
  },
  "2": {
    name: "2x6 - 3 Photo",
    ...baseLayout,
  },
  "3": {
    name: "4x6 - 3 Photo",
    ...baseLayout,
  },
  // Layout 4 sampai 11 bisa ditambahkan di sini
};

const Camera = () => {
  const router = useRouter();
  const webcamRef = useRef(null);
  
  const [photos, setPhotos] = useState([]); 
  const [isReady, setIsReady] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  
  // --- STATE BARU UNTUK TIMER & PENGATURAN ---
  const [countdown, setCountdown] = useState(0); 
  const [isCapturing, setIsCapturing] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true); // Default: Timer Aktif
  const [timerDuration, setTimerDuration] = useState(3); // Default: 3 Detik

  const { frame, layoutId } = router.query;

  useEffect(() => {
    if (frame && layoutId && layouts[layoutId]) {
      setSelectedLayout(layouts[layoutId]);
      setIsReady(true);
    }
  }, [frame, layoutId]);

  // --- LOGIKA TIMER ---
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isCapturing && countdown === 0) {
      // Timer selesai, ambil foto
      capturePhoto();
      setIsCapturing(false);
    }
  }, [countdown, isCapturing]);

  const capturePhoto = () => {
    if (webcamRef.current && selectedLayout && photos.length < selectedLayout.photoSlots) {
      const imgSrc = webcamRef.current.getScreenshot();
      setPhotos((prev) => [...prev, imgSrc]);
    }
  };
  
  // Fungsi yang dipanggil saat tombol ditekan
  const startPhotoProcess = () => {
    if (photos.length < selectedLayout.photoSlots && !isCapturing) {
      if (timerEnabled) {
        // Jika timer aktif, mulai hitung mundur
        setIsCapturing(true);
        setCountdown(timerDuration);
      } else {
        // Jika timer tidak aktif, ambil foto instan
        capturePhoto();
      }
    }
  };

  const resetPhotos = () => {
        setPhotos([]);
        setIsCapturing(false);
        setCountdown(0);
    };

  const downloadStrip = async () => {
    const element = document.getElementById("result-strip");
    const canvas = await html2canvas(element, { scale: 2 }); 
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = "photobooth-layout.png";
    link.click();
  };

  if (!isReady)
    return <div className="text-center p-10">Loading camera...</div>;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold text-pink-600">
        📸 Ambil Foto Kamu ({selectedLayout.name})
      </h1>

      {photos.length < selectedLayout.photoSlots && (
        <>
          {/* Pengaturan Timer */}
          <div className="flex gap-4 p-2 bg-white rounded-lg shadow-md">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <input 
                        type="checkbox" 
                        checked={timerEnabled} 
                        onChange={(e) => setTimerEnabled(e.target.checked)}
                        className="mr-2 accent-pink-500"
                    />
                    Gunakan Timer
                </label>
                
                {timerEnabled && (
                    <>
                        <button
                            onClick={() => setTimerDuration(3)}
                            className={`px-3 py-1 text-sm rounded transition 
                                ${timerDuration === 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            3s
                        </button>
                        <button
                            onClick={() => setTimerDuration(5)}
                            className={`px-3 py-1 text-sm rounded transition 
                                ${timerDuration === 5 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            5s
                        </button>
                    </>
                )}
            </div>
            {/* Akhir Pengaturan Timer */}


          <div className="relative w-full max-w-lg h-[500px] mb-4">
            {/* Tampilan Webcam */}
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full rounded-xl shadow-md object-cover"
              videoConstraints={{ facingMode: "user" }}
              mirrored = {true}
            />

            {/* Tampilan Hitung Mundur (Tanpa Latar Belakang Hitam Menyeluruh) */}
            {countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl z-20 pointer-events-none">
                <p className="text-pink-500 text-9xl font-extrabold animate-pulse text-center">
                  {countdown}
                </p>
              </div>
            )}
          </div>
          
          {/* Tombol Foto */}
          <button
            onClick={startPhotoProcess} // Menggunakan fungsi proses yang baru
            disabled={isCapturing} 
            className={`text-white px-4 py-2 rounded transition 
              ${isCapturing ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
          >
            {isCapturing 
              ? `Siap... ${countdown > 0 ? countdown : 'Ambil!'}` 
              : `Ambil Foto ${photos.length + 1}`
            }
          </button>
        </>
      )}

      {photos.length === selectedLayout.photoSlots && (
        <div className="flex flex-col items-center gap-4">
          <div
            id="result-strip"
            className="relative bg-white"
            style={{
              width: `${selectedLayout.canvasSize.width}px`,
              height: `${selectedLayout.canvasSize.height}px`,
            }}
          >
            {photos.map((src, i) => {
              const pos = selectedLayout.positions[i];
              return (
                <img
                  key={i}
                  src={src}
                  alt={`slot-${i}`}
                  className="absolute object-cover "
                  style={{
                    top: `${pos.top}px`,
                    left: `${pos.left}px`,
                    width: `${pos.width}px`,
                    height: `${pos.height}px`,
                  }}
                />
              );
            })}

            {/* Frame overlay */}
            <img
              src={frame}
              alt="frame overlay"
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadStrip}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              💾 Simpan Foto
            </button>
            <button
              onClick={resetPhotos}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🔄 Ulangi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
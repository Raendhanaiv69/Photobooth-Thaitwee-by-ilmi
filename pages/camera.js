"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

const baseLayout = {
    photoSlots: 3,
    positions: [
        { top: 40, left: 15, width: 240, height: 160 },
        { top: 220, left: 15, width: 240, height: 160 },
        { top: 400, left: 15, width: 240, height: 160 },
    ],
    canvasSize: { width: 270, height: 680 },
};

const layouts = {
    "1": { name: "2x6 - 3 Photo", ...baseLayout },
    "2": { name: "2x6 - 3 Photo", ...baseLayout },
    "3": { name: "4x6 - 3 Photo", ...baseLayout },
};

export default function Camera() {
    const router = useRouter();
    const webcamRef = useRef(null);

    const { frame, layoutId } = router.query;

    const [photos, setPhotos] = useState([]);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const [flash, setFlash] = useState(false);


    // Flash
    const triggerFlash = () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 150); // durasi flash 0.15 detik
    };
    // Timer
    const [countdown, setCountdown] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [timerDuration, setTimerDuration] = useState(3);

    // UI Baru → Halaman hasil
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (frame && layoutId && layouts[layoutId]) {
            setSelectedLayout(layouts[layoutId]);
            setIsReady(true);
        }
    }, [frame, layoutId]);

    // ----- helper to add photo and check if full -----
    const addPhoto = (img) => {
        if (!img) return;
        setPhotos((prev) => {
            const next = [...prev, img];
            // Jika sudah penuh → tampilkan hasil (sedikit delay agar UI sempat render)
            if (next.length === selectedLayout.photoSlots) {
                setTimeout(() => setShowResult(true), 300);
            }
            return next;
        });
    };

    // Ambil foto (mengembalikan base64 image atau null)
    const capturePhoto = () => {
        if (!webcamRef.current) return null;
        const img = webcamRef.current.getScreenshot();
        if (img) {
            addPhoto(img);
            return img;
        }
        return null;
    };

    // ----- Manual capture (untuk mode tanpa timer) -----
    const captureManual = () => {
        if (!webcamRef.current) return;
        if (photos.length >= selectedLayout.photoSlots) return;

        const img = webcamRef.current.getScreenshot();
        if (img) {
            setPhotos((prev) => [...prev, img]);
            triggerFlash(); // ⬅ efek flash muncul di sini
        }

        // Jika foto sudah lengkap → masuk hasil
        if (photos.length + 1 === selectedLayout.photoSlots) {
            setTimeout(() => setShowResult(true), 300);
        }
    };

    // Saat tombol foto ditekan (otomatis jika timer on)
    const startPhotoProcess = async () => {
        if (!selectedLayout) return;
        if (isCapturing || photos.length >= selectedLayout.photoSlots) return;

        setIsCapturing(true);

        // Ambil foto satu per satu sesuai jumlah slot yang tersisa
        for (let i = photos.length; i < selectedLayout.photoSlots; i++) {
            if (timerEnabled) {
                for (let c = timerDuration; c >= 1; c--) {
                    setCountdown(c);
                    await new Promise((res) => setTimeout(res, 1000));
                }
                setCountdown(0);
            }

            // Capture sekali (capturePhoto memanggil addPhoto)
            capturePhoto();
            // beri jeda kecil supaya kamera sempat render perubahan
            await new Promise((res) => setTimeout(res, 400));
        }

        setIsCapturing(false);
        // setShowResult sudah di-handle oleh addPhoto ketika penuh
    };

    // Simpan strip layout
    const downloadStrip = async () => {
        const element = document.getElementById("result-strip");
        if (!element || !selectedLayout) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            width: selectedLayout.canvasSize.width,
            height: selectedLayout.canvasSize.height,
            useCORS: true,
        });

        const data = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = data;
        link.download = "photobooth-strip.png";
        link.click();
    };

    // RESET ulang
    const resetAll = () => {
        setPhotos([]);
        setShowResult(false);
        setCountdown(0);
        setIsCapturing(false);
    };

    if (!isReady) return <div className="p-6 text-center">Loading Camera...</div>;

    // ======================================================
    // =============== HALAMAN HASIL (UI BARU) ==============
    // ======================================================
    if (showResult) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center p-6 bg-[#FFF9FB]">
                <h1 className="text-2xl font-bold mb-4">Hasil Foto</h1>

                <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                    {photos.map((src, i) => (
                        <div
                            key={i}
                            className="w-full rounded-3xl overflow-hidden shadow-xl border bg-white"
                        >
                            <img src={src} className="w-full object-cover" />
                        </div>
                    ))}
                </div>

                <button
                    onClick={resetAll}
                    className="mt-6 bg-[#FF4081] w-full max-w-sm h-12 text-white rounded-full text-lg font-semibold hover:bg-[#ff2d70]"
                >
                    Ulangi Ambil Foto
                </button>

                {/* Tombol simpan strip */}
                <button
                    onClick={() => setShowResult(false)}
                    className="mt-3 bg-green-500 w-full max-w-sm h-12 text-white rounded-full text-lg font-semibold"
                >
                    Lanjut ke Strip Layout
                </button>
            </div>
        );
    }

    // ======================================================
    // =============== HALAMAN STRIP LAYOUT =================
    // ======================================================
    if (photos.length === selectedLayout.photoSlots && !showResult) {
        return (
            <div className="flex flex-col items-center p-6 gap-4">
                <h1 className="text-xl font-bold">Preview Strip</h1>

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
                            <div
                                key={i}
                                className="absolute overflow-hidden"
                                style={{
                                    top: pos.top,
                                    left: pos.left,
                                    width: pos.width,
                                    height: pos.height,
                                }}
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        );
                    })}

                    <img
                        src={frame}
                        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                    />
                </div>

                <button
                    onClick={downloadStrip}
                    className="bg-green-600 text-white px-4 py-2 rounded-full"
                >
                    Simpan Strip
                </button>

                <button
                    onClick={resetAll}
                    className="bg-red-500 text-white px-4 py-2 rounded-full"
                >
                    Ambil Ulang
                </button>
            </div>
        );
    }

    // ======================================================
    // =============== HALAMAN KAMERA (UI BARU) =============
    // ======================================================
    return (
        <div className="w-full min-h-screen flex flex-col items-center p-4 bg-[#FDFDFD]">
            <h1 className="text-xl font-bold mb-4 text-[#FF4081]">
                📸 Ambil Foto Kamu ({selectedLayout.name})
            </h1>

            {/* Kamera */}
            <div className="relative w-full max-w-sm h-[480px] mb-4">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    mirrored
                    className="w-full h-full rounded-3xl object-cover shadow-xl"
                />

                {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-pink-500">
                        {countdown}
                    </div>
                )}
                {flash && (
                    <div className="absolute inset-0 bg-white opacity-80 rounded-3xl pointer-events-none"></div>
                )}
            </div>

            {/* Timer */}
            <div className="flex gap-4 mb-3">
                <label className="text-sm flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={timerEnabled}
                        onChange={(e) => setTimerEnabled(e.target.checked)}
                    />
                    Timer
                </label>

                {timerEnabled && (
                    <>
                        <button
                            onClick={() => setTimerDuration(3)}
                            className={`px-3 py-1 rounded-full ${timerDuration === 3 ? "bg-pink-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            3s
                        </button>

                        <button
                            onClick={() => setTimerDuration(5)}
                            className={`px-3 py-1 rounded-full ${timerDuration === 5 ? "bg-pink-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            5s
                        </button>
                    </>
                )}
            </div>

            {/* Tombol: otomatis jika timer on, manual jika timer off */}
            {timerEnabled ? (
                <button
                    onClick={startPhotoProcess}
                    disabled={isCapturing}
                    className="bg-[#FF4081] hover:bg-[#e63a75] disabled:bg-gray-400 text-white font-bold rounded-full w-full max-w-sm h-14"
                >
                    {isCapturing ? "Sedang Memotret..." : "Mulai Otomatis"}
                </button>
            ) : (
                <button
                    onClick={captureManual}
                    className="bg-[#FF4081] hover:bg-[#e63a75] text-white font-bold rounded-full w-full max-w-sm h-14"
                >
                    Ambil 1 Foto
                </button>
            )}
        </div>
    );
}

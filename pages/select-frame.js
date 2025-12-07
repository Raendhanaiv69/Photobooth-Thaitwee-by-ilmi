import Header from '../components/Header';
import { useRouter } from 'next/router';

export default function SelectFrame() {
  const router = useRouter();

  function handleSelect(frameType) {
    router.push({
      pathname: '/camera',
      query: { frame: frameType },
    });
  }

  return (
    <div className="min-h-screen bg-[#FFE1D6] relative overflow-hidden">
      {/* Navbar */}
      <Header />

      {/* Main content - Dibuat Responsif: flex-col pada ponsel, sm:flex-row pada desktop/tablet */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-25 px-4 space-y-8 sm:space-y-0 sm:space-x-8">
        
        {/* Choose Frame */}
        <div
          onClick={() => router.push('/framefixs')}
          // Menyesuaikan margin untuk tata letak vertikal/horizontal
          className="bg-[#CDE7FF] w-72 h-40 shadow-xl rounded-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition relative"
        >
          <img src="/images/frames/NANI.png" alt="Choose" className="absolute left-4 top-4 w-20 rotate-[15deg]" />
          <h2 className="text-xl font-bold text-orange-400 drop-shadow-sm z-10">Choose<br />Frame</h2>
        </div>

        {/* OR - Disesuaikan untuk posisi tengah di HP dan di antara 2 box di Desktop */}
        <div className="w-12 h-12 rounded-full bg-yellow-200 shadow text-center flex items-center justify-center text-lg font-bold text-orange-500 my-4 sm:my-0">
          OR
        </div>

        {/* Custom Frame */}
        <div
          onClick={() => handleSelect('custom')}
          // Menyesuaikan margin dan ukuran untuk konsistensi
          className="bg-[#F9C9F3] w-72 h-40 shadow-xl rounded-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition relative"
        >
          <img src="/images/frames/NANI.png" alt="Custom" className="absolute left-4 top-4 w-20 rotate-[15deg]" />
          <h2 className="text-xl font-bold text-pink-500 drop-shadow-sm z-10">Custom<br />Frame</h2>
        </div>
      </div>

      {/* Background slant */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-white rotate-[1deg] origin-bottom" />
    </div>
  );
}
export default function Header() {
  return (
    <div className="bg-white py-4 border-b-2 border-yellow-300">
      <div className="text-center text-3xl font-bold text-pink-500">
        ThaiTwee <span className="text-orange-400">Snap</span>
      </div>
      <div className="bg-yellow-200 py-2 flex justify-center gap-6 text-black font-medium">
        <a href="/" className="hover:underline">Home</a>
        <a href="/about" className="hover:underline">About</a>
        <a href="/shop" className="hover:underline">Shop</a>
      </div>
    </div>
  );
}
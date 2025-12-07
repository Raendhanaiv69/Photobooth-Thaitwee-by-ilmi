"use client";

import React, { useState } from "react";

const AdminUploadFrame = () => {
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label || !file) {
      alert("Nama frame dan file wajib diisi!");
      return;
    }

    // Simulasi pengiriman ke server/backend
    alert("Frame berhasil diupload (simulasi)");
    console.log("Label:", label);
    console.log("File:", file);

    // Reset form
    setLabel("");
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-pink-500 mb-6">
          📤 Upload Frame Photobooth
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nama Frame
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-pink-300"
              placeholder="Contoh: Cute Pink"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Pilih File Frame (.png)
            </label>
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Pratinjau:
              </p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-40 h-[480px] object-contain border rounded-md shadow"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Upload Frame
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUploadFrame;

"use client";
import React, { useState } from "react";

const ProsedurPeminjaman = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Prosedur Peminjaman</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <ol className="list-decimal list-inside space-y-4">
          <li>
            <span className="font-semibold">Mahasiswa / dosen / alumni</span> harus melakukan negosiasi terlebih dahulu melalui UPK.
          </li>
          <li>Setelah disetujui oleh UPK, Mahasiswa / dosen / alumni mengisi formulir peminjaman dan mengupload bukti formulir yang sudah disetujui oleh UPK.</li>
          <li>Mahasiswa / dosen / alumni harus melakukan pengajuan peminjaman maksimal H-1 sebelum kegiatan.</li>
          <li>Peminjaman hanya berlaku sampai pukul 18.00 WIB.</li>
          <li>Peminjaman harus di luar jam perkuliahan.</li>
        </ol>
      </div>
      <button onClick={handleOpenModal} className="mt-6 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200">
        Ajukan Peminjaman
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Form Peminjaman</h2>
            {/* Tambahkan form input di sini */}
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nama:</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Masukkan nama" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tanggal Peminjaman:</label>
                <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
              </div>
              {/* Tambahkan field lain sesuai kebutuhan */}
              <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200">
                Kirim
              </button>
            </form>
            <button onClick={handleCloseModal} className="mt-4 text-red-500">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsedurPeminjaman;

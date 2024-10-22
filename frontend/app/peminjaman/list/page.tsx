"use client";
import React, { useState } from "react";
import PeminjamanFormModal from "../form/page"; // Import the modal
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast notifications

const ProsedurPeminjaman = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (formData, user) => {
    try {
      const response = await fetch("http://localhost:5000/api/peminjaman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id, // Use the actual user ID
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Peminjaman submitted successfully:", result);
        toast.success("Pengajuan Peminjaman berhasil dilakukan!"); // Show success notification
        handleCloseModal(); // Close the modal after submission
      } else {
        const error = await response.json();
        console.error("Error submitting peminjaman:", error);
        toast.error("Gagal melakukan pengajuan peminjaman."); // Show error notification
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi."); // Show error notification
    }
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
          <li>Peminjaman harus diajukan maksimal H-1 sebelum kegiatan.</li>
          <li>Peminjaman hanya berlaku sampai pukul 18.00 WIB.</li>
          <li>Peminjaman harus di luar jam perkuliahan.</li>
        </ol>
      </div>
      <button onClick={handleOpenModal} className="mt-6 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200">
        Ajukan Peminjaman
      </button>

      {/* Include the modal component */}
      <PeminjamanFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />

      {/* Toast container to display notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProsedurPeminjaman;

"use client";
import React, { useState, useEffect } from "react";
import PeminjamanFormModal from "../form/page"; // Import the modal
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast notifications

const ProsedurPeminjaman = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null); // State to hold file
  const [user, setUser] = useState({ id: "" }); // State to hold user data

  // Use effect to load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Set user data from localStorage
    }
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (formData) => {
    try {
      const finalData = new FormData(); // Use FormData to send the file
      // Append form fields
      finalData.append("keperluan", formData.keperluan);
      finalData.append("nama_kegiatan", formData.nama_kegiatan);
      finalData.append("barangId", formData.barangId);
      finalData.append("startDate", formData.startDate);
      finalData.append("endDate", formData.endDate);
      finalData.append("startTime", formData.startTime);
      finalData.append("endTime", formData.endTime);
      finalData.append("nama_peminjam", user.name);
      finalData.append("role_peminjam", user.role);
      finalData.append("userId", user.id);

      if (file) {
        finalData.append("bukti_persetujuan", file); // Append the file
      }

      // Send the request to the backend
      const response = await fetch("http://localhost:5000/api/peminjaman", {
        method: "POST",
        body: finalData, // Send FormData, not JSON
      });

      if (response.ok) {
        toast.success("Pengajuan Peminjaman Berhasil ");
        handleCloseModal();
      } else {
        toast.error("Gagal untuk melakukan Pengajuan.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
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
      <PeminjamanFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} onFileChange={handleFileChange} />

      {/* Toast container to display notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProsedurPeminjaman;

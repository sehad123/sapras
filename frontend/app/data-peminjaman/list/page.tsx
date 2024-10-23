"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import CustomModal from "../../components/Modal";

const PeminjamanList = () => {
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const itemsPerPage = 6;

  // Fetch all peminjaman data from the backend
  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/peminjaman");
        const data = await response.json();
        setPeminjamanList(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching peminjaman data:", error);
      }
    };

    fetchPeminjaman();
  }, []);

  // Handle modal open/close
  const openModal = (action, id) => {
    setCurrentAction(action);
    setCurrentId(id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentAction(null);
    setCurrentId(null);
  };

  // Handle accept action
  const handleAccept = async () => {
    closeModal(); // Close modal first
    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/${currentId}/approve`, {
        method: "PUT",
      });

      if (response.ok) {
        toast.success("Peminjaman Diterima!");
        setPeminjamanList((prevList) => prevList.map((item) => (item.id === currentId ? { ...item, status: "APPROVED" } : item)));
      } else {
        toast.error("Failed to approve peminjaman.");
      }
    } catch (error) {
      console.error("Error approving peminjaman:", error);
      toast.error("Error approving peminjaman.");
    }
  };

  // Handle reject action
  const handleReject = async () => {
    closeModal(); // Close modal first
    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/${currentId}/reject`, {
        method: "PUT",
      });

      if (response.ok) {
        toast.success("Peminjaman Ditolak!");
        setPeminjamanList((prevList) => prevList.map((item) => (item.id === currentId ? { ...item, status: "REJECTED" } : item)));
      } else {
        toast.error("Failed to reject peminjaman.");
      }
    } catch (error) {
      console.error("Error rejecting peminjaman:", error);
      toast.error("Error rejecting peminjaman.");
    }
  };

  // Filtering logic
  useEffect(() => {
    let filtered = peminjamanList;

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) => item.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase()) || item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (startDateFilter && endDateFilter) {
      filtered = filtered.filter((item) => new Date(item.startDate) >= new Date(startDateFilter) && new Date(item.endDate) <= new Date(endDateFilter));
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setelah filter
  }, [statusFilter, searchTerm, startDateFilter, endDateFilter, peminjamanList]);

  // Handle pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Peminjaman</h1>

      {/* Filters */}
      <div className="bg-gray-100 p-4 mb-4 rounded-md shadow-md flex flex-col md:flex-row justify-between gap-10">
        {/* Kontainer untuk dua filter pertama di sebelah kiri */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
            <label className="block mb-2 text-sm">Status:</label>
            <select className="p-2 border rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="PENDING">PENDING</option>
              <option value="DIKEMBALIKAN">DIKEMBALIKAN</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Cari Nama atau Kegiatan:</label>
            <input type="text" className="p-2 border rounded-md" placeholder="Nama atau Kegiatan" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Kontainer untuk dua filter berikutnya di sebelah kanan */}
        <div className="flex flex-col md:flex-row gap-10">
          <div>
            <label className="block mb-2 text-sm">Tanggal Mulai:</label>
            <input type="date" className="p-2 border rounded-md" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
          </div>

          <div>
            <label className="block mb-2 text-sm">Tanggal Selesai:</label>
            <input type="date" className="p-2 border rounded-md" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        {currentItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((peminjaman) => (
              <div key={peminjaman.id} className="border rounded-lg p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-2">{peminjaman.user.name}</h2>
                <p className="text-sm mb-1">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${peminjaman.user.email}`}
                    className="text-blue-500 underline"
                    onClick={(e) => e.stopPropagation()} // jika ada penanganan klik lain
                  >
                    {peminjaman.user.email}
                  </a>
                </p>
                <p className="text-sm mb-1">
                  <strong>Peran:</strong> {peminjaman.user.role}
                </p>
                <p className="text-sm mb-1">
                  <strong>Nama Barang:</strong> {peminjaman.barang.name}
                </p>
                <p className="text-sm mb-1">
                  <strong>Tanggal Peminjaman:</strong>{" "}
                  {new Date(peminjaman.startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm mb-1">
                  <strong>Tanggal Pengembalian:</strong>{" "}
                  {new Date(peminjaman.endDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm mb-1">
                  <strong>Waktu Kegiatan:</strong> {peminjaman.startTime} - {peminjaman.endTime}
                </p>
                <p className="text-sm mb-1">
                  <strong>Nama Kegiatan:</strong> {peminjaman.nama_kegiatan}
                </p>
                <p className="text-sm mb-1">
                  <strong>Waktu Pengajuan:</strong>{" "}
                  {new Date(peminjaman.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  /{" "}
                  {new Date(peminjaman.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm mb-1">
                  <strong>Status:</strong> {peminjaman.status}
                </p>
                <div className="flex justify-between items-center mt-4">
                  {peminjaman.bukti_persetujuan ? (
                    <a href={`http://localhost:5000/uploads/${peminjaman.bukti_persetujuan}`} className="text-blue-500 underline" download>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        <FontAwesomeIcon icon={faFile} className="mr-2" />
                        Bukti Persetujuan
                      </button>
                    </a>
                  ) : null}
                  <div>
                    {peminjaman.status === "PENDING" && (
                      <>
                        <button onClick={() => openModal("accept", peminjaman.id)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                          Terima
                        </button>
                        <button onClick={() => openModal("reject", peminjaman.id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Tidak ada peminjaman yang ditemukan.</p>
        )}
      </div>

      <CustomModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onConfirm={currentAction === "accept" ? handleAccept : handleReject}
        title="Konfirmasi Tindakan"
        message={`Apakah Anda yakin ingin ${currentAction === "accept" ? "menerima" : "menolak"} peminjaman ini?`}
        isAccept={currentAction === "accept"} // Pass action type
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Prev
        </button>
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <button className="px-4 py-2 bg-gray-200 rounded-md" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PeminjamanList;

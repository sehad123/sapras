"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PeminjamanList = ({ userId }) => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      if (!userId) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/peminjaman/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch peminjaman data");
        }
        const data = await response.json();
        setPeminjaman(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeminjaman();
  }, [userId]);

  const handleReturn = async (peminjamanId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/peminjaman/${peminjamanId}/kembali`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Barang gagal dikembalikan");
      }
      const updatedItem = await response.json();

      // Menggunakan toast untuk notifikasi sukses
      toast.success("Barang Berhasil Dikembalikan !", {});

      // Update the list locally without re-fetching
      setPeminjaman((prevPeminjaman) => prevPeminjaman.map((item) => (item.id === peminjamanId ? { ...item, status: "DIKEMBALIKAN" } : item)));
    } catch (error) {
      // Menggunakan toast untuk notifikasi error
      toast.error(error.message, {});
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="peminjaman-list p-6 bg-gray-100 mx-10 mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Daftar Peminjaman Anda</h1>
      {peminjaman.length === 0 ? (
        <p>Belum ada peminjaman untuk user ini.</p>
      ) : (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">No</th>
              <th className="py-3 px-4 text-left">Nama Barang</th>
              <th className="py-3 px-4 text-left">Keperluan</th>
              <th className="py-3 px-4 text-left">Tanggal Peminjaman</th>
              <th className="py-3 px-4 text-left">Tanggal Pengembalian</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Bukti Persetujuan</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {peminjaman.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{item.barang.name}</td> {/* Display the barang name */}
                <td className="py-2 px-4">{item.keperluan}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(item.startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(item.endDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2 px-4">{item.status}</td>
                <td className="py-2 px-4 translate-x-12">
                  {item.bukti_persetujuan ? (
                    <a href={`http://localhost:5000/uploads/${item.bukti_persetujuan}`} className="text-blue-500 underline" download>
                      <FontAwesomeIcon icon={faFile} />
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td className="py-2 px-4">
                  {item.status === "APPROVED" && (
                    <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition duration-200" onClick={() => handleReturn(item.id)}>
                      Kembalikan
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default PeminjamanList;

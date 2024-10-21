"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterBarang() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    kondisi: "",
    available: true, // Default to true
    lokasi: "",
    photo: null, // Field for image upload
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("kondisi", formData.kondisi);
    formDataToSend.append("available", formData.available); // Append boolean value
    formDataToSend.append("lokasi", formData.lokasi);
    formDataToSend.append("photo", formData.photo); // Append the photo

    const res = await fetch("http://localhost:5000/barang/add", {
      method: "POST",
      body: formDataToSend,
    });

    if (res.ok) {
      toast.success("Penambahan Barang berhasil!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTimeout(() => {
        router.push("/data-barang"); // Redirect to barang data page
      }, 3000);
    } else {
      toast.error("Penambahan Barang gagal, coba lagi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleAvailableChange = (e) => {
    setFormData({ ...formData, available: e.target.value === "ya" });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Tambah Barang</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Nama Barang */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nama Barang</label>
            <input
              type="text"
              placeholder="Nama Barang"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Jenis Barang */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Jenis Barang</label>
            <input
              type="text"
              placeholder="Jenis Barang"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Kondisi */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Kondisi</label>
            <input
              type="text"
              placeholder="Kondisi"
              value={formData.kondisi}
              onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Lokasi */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Lokasi</label>
            <input
              type="text"
              placeholder="Lokasi Barang"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Available (Dropdown) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Tersedia</label>
            <select value={formData.available ? "ya" : "tidak"} onChange={handleAvailableChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Foto Barang</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Tambah Barang
          </button>
        </form>
      </div>
    </div>
  );
}

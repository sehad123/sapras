"use client";
import React, { useState, useEffect } from "react";

const PeminjamanFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [barang, setBarang] = useState([]);
  const [user, setUser] = useState({ name: "", role: "", email: "", id: "" }); // State to store user data
  useEffect(() => {
    // Fetch user data from localStorage (or any other storage method)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Set user data from storage
    }
  }, []);
  const [formData, setFormData] = useState({
    keperluan: "",
    nama_kegiatan: "",
    barangId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    nama_peminjam: "", // These will be updated when user data is set
    role_peminjam: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  // Fetch kategori options on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData((prevData) => ({
        ...prevData,
        nama_peminjam: storedUser.name,
        role_peminjam: storedUser.role,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kategori");
        const data = await response.json();
        setKategori(data);
      } catch (error) {
        console.error("Error fetching kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  // Fetch barang based on selected kategori
  useEffect(() => {
    const fetchBarang = async () => {
      if (selectedKategori) {
        try {
          const response = await fetch(`http://localhost:5000/api/barangtersedia?kategoriId=${selectedKategori}`);
          const data = await response.json();
          setBarang(data);
        } catch (error) {
          console.error("Error fetching barang:", error);
        }
      } else {
        // Clear barang if no kategori is selected
        setBarang([]);
      }
    };

    fetchBarang();
  }, [selectedKategori]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Real-time validation for the current input field
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errors = { ...validationErrors };
    const today = new Date();

    if (name === "startDate") {
      const startDate = new Date(value);
      if (startDate < today) {
        errors.startDate = "Tanggal peminjaman tidak bisa sebelum hari ini.";
      } else if (startDate == today) {
        errors.startDate = "Tanggal peminjaman tidak bisa hari ini. maksimal H-1";
      } else {
        errors.startDate = ""; // Clear error if valid
      }
    }

    if (name === "endDate") {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(value);
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(startDate.getDate() + 10);

      if (endDate > maxEndDate) {
        errors.endDate = "Tanggal pengembalian maksimal 10 hari dari tanggal peminjaman.";
      } else if (endDate < startDate) {
        errors.endDate = "Tanggal pengembalian tidak bisa mendahului tanggal peminjaman.";
      } else {
        errors.endDate = ""; // Clear error if valid
      }
    }

    if (name === "startTime") {
      const startHour = parseInt(value.split(":")[0]);
      if (startHour < 7) {
        errors.startTime = "Waktu mulai tidak boleh sebelum jam 7 pagi.";
      } else {
        errors.startTime = ""; // Clear error if valid
      }
    }

    if (name === "endTime") {
      const endHour = parseInt(value.split(":")[0]);
      if (endHour > 22) {
        errors.endTime = "Waktu berakhir tidak boleh setelah jam 10 malam.";
      } else {
        errors.endTime = ""; // Clear error if valid
      }
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (Object.values(validationErrors).some((error) => error)) {
      return; // Exit if there are validation errors
    }

    // Call the passed onSubmit function instead of handling submission here
    onSubmit(formData, user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close modal icon */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center">Form Peminjaman</h2>
        <form onSubmit={handleSubmit}>
          {/* Select Keperluan */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Keperluan:</label>
            <select name="keperluan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.keperluan} onChange={handleChange} required>
              <option value="">Pilih Keperluan</option>
              <option value="Akademik">Akademik</option>
              <option value="Non Akademik">Non Akademik</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
            <input type="text" name="nama_kegiatan" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.nama_kegiatan} onChange={handleChange} required />
          </div>

          {/* Select Kategori */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Kategori:</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} required>
              <option value="">Pilih Kategori</option>
              {kategori.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Select Barang */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Barang:</label>
            <select
              name="barangId"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.barangId}
              onChange={handleChange}
              required
              disabled={!selectedKategori} // Disable if no kategori is selected
            >
              <option value="">Pilih Barang</option>
              {barang.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time fields */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Tanggal Peminjaman:</label>
            <input type="date" name="startDate" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.startDate} onChange={handleChange} required />
            {validationErrors.startDate && <p className="text-red-500 text-xs">{validationErrors.startDate}</p>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Tanggal Pengembalian:</label>
            <input type="date" name="endDate" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.endDate} onChange={handleChange} required />
            {validationErrors.endDate && <p className="text-red-500 text-xs">{validationErrors.endDate}</p>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Waktu Mulai:</label>
            <input type="time" name="startTime" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.startTime} onChange={handleChange} required />
            {validationErrors.startTime && <p className="text-red-500 text-xs">{validationErrors.startTime}</p>}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Waktu Berakhir:</label>
            <input type="time" name="endTime" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.endTime} onChange={handleChange} required />
            {validationErrors.endTime && <p className="text-red-500 text-xs">{validationErrors.endTime}</p>}
          </div>

          <button type="submit" className="mt-4 w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700">
            Ajukan Peminjaman
          </button>
        </form>

        {/* Toast container to display notifications */}
      </div>
    </div>
  );
};

export default PeminjamanFormModal;

"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddBarangModal from "../add/page";
import EditBarangModal from "../edit/page";
import DeleteConfirmationModal from "../delete/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BarangList() {
  const [barangList, setBarangList] = useState([]);
  const [filteredBarangList, setFilteredBarangList] = useState([]);
  const [error, setError] = useState(null);
  const [editingBarang, setEditingBarang] = useState(null);
  const [deletingBarang, setDeletingBarang] = useState(null);
  const [addingBarang, setAddingBarang] = useState(false);
  const [searchName, setSearchName] = useState(""); // State for search input
  const [searchKondisi, setSearchKondisi] = useState(""); // State for search input
  const [searchLokasi, setSearchLokasi] = useState(""); // State for search input
  const [availabilityFilter, setAvailabilityFilter] = useState(""); // State for availability filter
  const [categoryFilter, setCategoryFilter] = useState(""); // State for category filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Items per page

  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/barang");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setBarangList(data);
        setFilteredBarangList(data);
      } catch (error) {
        console.error("Error fetching barang:", error.message);
        setError("Failed to fetch barang. Please try again later.");
      }
    };

    fetchBarangList();
  }, []);

  // Handle filtering
  useEffect(() => {
    const filteredList = barangList
      .filter((barang) => barang.name.toLowerCase().includes(searchName.toLowerCase()))
      .filter((barang) => barang.lokasi.toLowerCase().includes(searchLokasi.toLowerCase()))
      .filter((barang) => barang.kondisi.toLowerCase().includes(searchKondisi.toLowerCase()))
      .filter((barang) => (availabilityFilter ? barang.available === availabilityFilter : true))
      .filter((barang) => (categoryFilter ? barang.type === categoryFilter : true));
    setFilteredBarangList(filteredList);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchName, searchKondisi, searchLokasi, availabilityFilter, categoryFilter, barangList]);

  // Handle pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const paginatedBarangList = filteredBarangList.slice(firstIndex, lastIndex);

  const handleAddBarang = () => setAddingBarang(true);
  const handleCloseAddModal = () => setAddingBarang(false);

  const handleSaveBarang = async (newBarang) => {
    try {
      const res = await fetch("http://localhost:5000/api/barang/add", {
        method: "POST",
        body: newBarang,
      });

      if (res.ok) {
        const data = await res.json();
        setBarangList((prevBarang) => [...prevBarang, data]);
        handleCloseAddModal();
        toast.success("Penambahan Barang berhasil!");
      } else {
        toast.error("Penambahan Barang gagal, coba lagi.");
      }
    } catch (error) {
      console.error("Error saving barang:", error.message);
      setError("Error saving barang.");
    }
  };

  const handleSaveEditBarang = async (id, updatedBarang) => {
    try {
      const res = await fetch(`http://localhost:5000/api/barang/${id}`, {
        method: "PATCH",
        body: updatedBarang,
      });

      if (res.ok) {
        const data = await res.json();
        setBarangList((prevBarangList) => prevBarangList.map((barang) => (barang.id === id ? data : barang)));
        setEditingBarang(null);
        toast.success("Perubahan Barang berhasil!");
      } else {
        toast.error("Perubahan Barang gagal, coba lagi.");
      }
    } catch (error) {
      console.error("Error editing barang:", error.message);
      setError("Error editing barang.");
    }
  };

  const handleDeleteBarang = async (barangId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/barang/${barangId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBarangList((prevBarangList) => prevBarangList.filter((barang) => barang.id !== barangId));
        setDeletingBarang(null);
        toast.success("Penghapusan Barang berhasil!");
      } else {
        toast.error("Penghapusan Barang gagal, coba lagi.");
      }
    } catch (error) {
      console.error("Error deleting barang:", error.message);
      setError("Error deleting barang.");
    }
  };

  // Handle pagination navigation
  const totalPages = Math.ceil(filteredBarangList.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset filter
  const handleResetFilter = () => {
    setSearchName("");
    setSearchKondisi("");
    setSearchLokasi("");
    setAvailabilityFilter("");
    setCategoryFilter("");
    setFilteredBarangList(barangList); // Reset to full list
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Barang & Ruangan</h1>
        <div className="flex justify-end mb-4 -translate-y-16 ">
          <button className="bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-200" onClick={handleAddBarang}>
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 -translate-y-10">
          <input type="text" className="p-2 border rounded-md mb-2 md:mb-0 md:mr-4" placeholder="Cari berdasarkan nama" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          <input type="text" className="p-2 border rounded-md mb-2 md:mb-0 md:mr-4" placeholder="Cari berdasarkan Kondisi" value={searchKondisi} onChange={(e) => setSearchKondisi(e.target.value)} />
          <input type="text" className="p-2 border rounded-md mb-2 md:mb-0 md:mr-4" placeholder="Cari berdasarkan Lokasi" value={searchLokasi} onChange={(e) => setSearchLokasi(e.target.value)} />

          <select className="p-2 border rounded-md mb-2 md:mb-0 md:mr-4" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
            <option value="">Semua Ketersediaan</option>
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>

          <select className="p-2 border rounded-md mb-2 md:mb-0 md:mr-4" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Semua Kategori</option>
            <option value="Barang">Barang</option>
            <option value="Ruangan">Ruangan</option>
          </select>

          <button onClick={handleResetFilter} className="bg-red-500 text-white p-2 rounded-md">
            Reset Filter
          </button>
        </div>

        {/* Table */}
        <table className="w-full table-auto bg-gray-100 border-collapse -translate-y-10">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-6 py-3 text-left">No</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Nama</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Kategori</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Kondisi</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Lokasi</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Photo</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Tersedia</th>
              <th className="border border-gray-300 px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBarangList.length > 0 ? (
              paginatedBarangList.map((barang, index) => (
                <tr key={barang.id} className="hover:bg-gray-100">
                  <td className="border px-6 py-3">{firstIndex + index + 1}</td>
                  <td className="border px-6 py-3">{barang.name}</td>
                  <td className="border px-6 py-3">{barang.type}</td>
                  <td className="border px-6 py-3">{barang.kondisi}</td>
                  <td className="border px-6 py-3">{barang.lokasi}</td>
                  <td className="border border-gray-300 px-6 py-3">{barang.photo ? <img src={`http://localhost:5000${barang.photo}`} alt={barang.name} className="w-20 h-20 object-cover" /> : "No Image"}</td>
                  <td className="border px-6 py-3">{barang.available}</td>
                  <td className="border px-6 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => setEditingBarang(barang)}>
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
                      </button>
                      <button onClick={() => setDeletingBarang(barang)}>
                        <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Tidak ada barang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`p-2 px-4 mx-2 bg-gray-200 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
            Previous
          </button>

          <span className="p-2 px-4">
            Page {currentPage} of {totalPages}
          </span>

          <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`p-2 px-4 mx-2 bg-gray-200 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
            Next
          </button>
        </div>
      </div>

      {addingBarang && <AddBarangModal onSave={handleSaveBarang} onClose={handleCloseAddModal} />}
      {editingBarang && <EditBarangModal barang={editingBarang} onSave={handleSaveEditBarang} onClose={() => setEditingBarang(null)} />}
      {deletingBarang && <DeleteConfirmationModal barang={deletingBarang} onConfirmDelete={() => handleDeleteBarang(deletingBarang.id)} onClose={() => setDeletingBarang(null)} />}
    </div>
  );
}

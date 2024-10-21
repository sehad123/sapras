"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddBarangModal from "../add/page"; // Import the Add modal component for barang
import EditBarangModal from "../edit/page"; // Import the edit modal component for barang
import DeleteConfirmationModal from "../delete/page"; // Import the delete modal
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BarangList() {
  const [barangList, setBarangList] = useState([]);
  const [error, setError] = useState(null);
  const [editingBarang, setEditingBarang] = useState(null);
  const [deletingBarang, setDeletingBarang] = useState(null);
  const [addingBarang, setAddingBarang] = useState(false); // State to handle opening add modal

  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/barang");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setBarangList(data);
      } catch (error) {
        console.error("Error fetching barang:", error.message);
        setError("Failed to fetch barang. Please try again later.");
      }
    };

    fetchBarangList();
  }, []);

  // Handle Add Barang Modal open
  const handleAddBarang = () => {
    setAddingBarang(true); // Show the Add modal
  };

  // Handle Add Barang Modal close
  const handleCloseAddModal = () => {
    setAddingBarang(false); // Close the Add modal
  };

  // Handle Save new barang
  const handleSaveBarang = async (newBarang) => {
    try {
      const res = await fetch("http://localhost:5000/api/barang/add", {
        method: "POST",
        body: newBarang, // Send FormData directly
      });

      if (res.ok) {
        const data = await res.json();
        setBarangList((prevBarang) => [...prevBarang, data]); // Add new barang to list
        handleCloseAddModal(); // Close the Add modal

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
    } catch (error) {
      console.error("Error saving barang:", error.message);
      setError("Error saving barang.");
    }
  };

  // Handle Save edited barang
  const handleSaveEditBarang = async (id, updatedBarang) => {
    try {
      const res = await fetch(`http://localhost:5000/api/barang/${id}`, {
        // Use the correct ID here
        method: "PATCH",
        body: updatedBarang, // Send updated data (FormData)
      });

      if (res.ok) {
        const data = await res.json();
        setBarangList((prevBarangList) => prevBarangList.map((barang) => (barang.id === id ? data : barang))); // Update barang list
        setEditingBarang(null); // Close the edit modal

        toast.success("Perubahan Barang berhasil!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Perubahan Barang gagal, coba lagi.", {
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
    } catch (error) {
      console.error("Error editing barang:", error.message);
      setError("Error editing barang.");
    }
  };
  // Handle Delete barang
  const handleDeleteBarang = async (barangId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/barang/${barangId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBarangList((prevBarangList) => prevBarangList.filter((barang) => barang.id !== barangId)); // Remove deleted barang from list
        setDeletingBarang(null); // Close the delete modal

        toast.success("Penghapusan Barang berhasil!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Penghapusan Barang gagal, coba lagi.", {
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
    } catch (error) {
      console.error("Error deleting barang:", error.message);
      setError("Error deleting barang.");
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      {/* Toast Container */}
      <ToastContainer />

      {/* Add Plus Icon */}
      <button className="absolute top-1 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200" onClick={handleAddBarang}>
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Barang</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Barang List Table */}
        <table className="w-full table-auto bg-gray-100 border-collapse">
          {/* Table Headers */}
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Kondisi</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Lokasi</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Photo</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Tersedia</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {barangList.length > 0 ? (
              barangList.map((barang, index) => (
                <tr key={barang.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{barang.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{barang.type || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{barang.kondisi || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{barang.lokasi || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{barang.photo ? <img src={`http://localhost:5000${barang.photo}`} alt={barang.name} className="w-20 h-20 object-cover" /> : "No Image"}</td>
                  <td className="border border-gray-300 px-4 py-2">{barang.available || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center space-x-4">
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
                  No barang found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Barang Modal */}
        {addingBarang && <AddBarangModal onClose={handleCloseAddModal} onSave={handleSaveBarang} />}

        {/* Edit and Delete Modals */}
        {editingBarang && <EditBarangModal barang={editingBarang} onClose={() => setEditingBarang(null)} onSave={handleSaveEditBarang} />}
        {deletingBarang && <DeleteConfirmationModal barang={deletingBarang} onClose={() => setDeletingBarang(null)} onDelete={() => handleDeleteBarang(deletingBarang.id)} />}
      </div>
    </div>
  );
}

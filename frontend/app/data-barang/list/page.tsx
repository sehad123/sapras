"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditBarangModal from "../edit/page"; // Import the edit modal component for barang
import DeleteConfirmationModal from "../delete/page"; // Import the delete modal

export default function BarangList() {
  const [barangList, setBarangList] = useState([]); // State for the list of barang
  const [error, setError] = useState(null); // State for handling errors
  const [editingBarang, setEditingBarang] = useState(null); // State for the barang being edited
  const [deletingBarang, setDeletingBarang] = useState(null); // State for the barang being deleted
  const router = useRouter();

  // Fetch barang list when the component loads
  useEffect(() => {
    const fetchBarangList = async () => {
      try {
        const res = await fetch("http://localhost:5000/barang"); // Endpoint for fetching barang data
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

  // Handle add new barang
  const handleAddBarang = () => {
    router.push("/data-barang/add");
  };

  // Handle opening edit modal for a barang
  const handleEditBarang = (barang) => {
    setEditingBarang(barang); // Set the barang being edited
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setEditingBarang(null); // Close the modal by setting the state to null
  };

  // Handle saving changes after editing
  const handleSaveBarang = async (id, updatedBarang) => {
    try {
      const res = await fetch(`http://localhost:5000/barang/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBarang),
      });
      if (!res.ok) {
        throw new Error(`Failed to update barang. Status: ${res.status}`);
      }
      const data = await res.json();

      // Update the state with the updated barang
      setBarangList((prevBarang) => prevBarang.map((barang) => (barang.id === id ? data : barang)));
      handleCloseEditModal(); // Close the modal
    } catch (error) {
      console.error("Error updating barang:", error.message);
      setError("Error updating barang.");
    }
  };

  // Handle opening delete confirmation modal
  const handleDeleteBarang = (barang) => {
    setDeletingBarang(barang); // Set the barang to be deleted
  };

  // Handle closing the delete modal
  const handleCloseDeleteModal = () => {
    setDeletingBarang(null); // Close the modal
  };

  // Handle confirming delete barang
  const handleConfirmDelete = async () => {
    if (deletingBarang) {
      try {
        const res = await fetch(`http://localhost:5000/barang/${deletingBarang.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error(`Failed to delete barang. Status: ${res.status}`);
        }
        setBarangList(barangList.filter((barang) => barang.id !== deletingBarang.id)); // Remove the barang from the state
        handleCloseDeleteModal(); // Close the modal after deleting
      } catch (error) {
        console.error("Error deleting barang:", error.message);
        setError("Error deleting barang.");
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      {/* Add Plus Icon */}
      <button className="absolute top-1 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200" onClick={handleAddBarang}>
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Barang</h1>

        {/* Error message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* List of Barang */}
        <table className="w-full table-auto bg-gray-100 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Kondisi</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Lokasi</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Photo</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Tersedia</th> {/* New column for availability */}
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
                  <td className="border border-gray-300 px-4 py-2">{barang.photo ? <img src={`http://localhost:5000/${barang.photo}`} alt={barang.name} className="w-20 h-20 object-cover" /> : "No Image"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{barang.available == 1 ? "Ya" : "Tidak"}</td> {/* Display "Ya" or "Tidak" based on available value */}
                  <td className="border border-gray-300 px-4 py-2 flex justify-around text-center">
                    {/* Edit and Delete Icons */}
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditBarang(barang)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteBarang(barang)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-600 py-4">
                  Tidak ada Barang yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Barang Modal */}
      {editingBarang && <EditBarangModal barang={editingBarang} onClose={handleCloseEditModal} onSave={handleSaveBarang} />}

      {/* Delete Confirmation Modal */}
      {deletingBarang && <DeleteConfirmationModal barang={deletingBarang} onClose={handleCloseDeleteModal} onDelete={handleConfirmDelete} />}
    </div>
  );
}

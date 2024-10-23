import React from "react";

const CustomModal = ({ isOpen, onClose, onConfirm, title, message, isAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2">{message}</p>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded-md mr-2" onClick={onClose}>
            Batal
          </button>
          <button className={`px-4 py-2 rounded-md text-white ${isAccept ? "bg-green-500" : "bg-red-500"}`} onClick={onConfirm}>
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

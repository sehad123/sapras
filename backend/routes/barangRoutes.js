const express = require("express");
const { addBarang, getAllBarang, getBarangById, updateBarang, deleteBarang } = require("../services/barangService");
const upload = require("../utils/multerSetup"); // Import multer setup
const router = express.Router();
const asyncHandler = require("express-async-handler"); // For async error handling

// Route for adding barang (with photo upload)
router.post(
  "/barang/add",
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const { name, type, lokasi, kondisi } = req.body;
    const photoPath = req.file ? req.file.path : null; // Get the file path

    const barang = await addBarang({ name, type, lokasi, kondisi, photo: photoPath });
    res.json(barang);
  })
);

// Get all barang
router.get(
  "/barang",
  asyncHandler(async (req, res) => {
    const barang = await getAllBarang();
    res.json(barang);
  })
);

// Get a barang by ID
router.get(
  "/barang/:id",
  asyncHandler(async (req, res) => {
    const barang = await getBarangById(req.params.id);
    if (!barang) {
      return res.status(404).json({ error: "Barang not found" });
    }
    res.json(barang);
  })
);

// Update a barang by ID
router.patch(
  "/barang/:id",
  upload.single("photo"), // Allow photo upload during update
  asyncHandler(async (req, res) => {
    const { name, type, lokasi, kondisi, available } = req.body;
    const photoPath = req.file ? req.file.path : null; // Get the new file path if uploaded

    // Create an object for the updated data
    const updatedData = {};

    // Only include fields that are present in the request body
    if (name) updatedData.name = name;
    if (type) updatedData.type = type;
    if (lokasi) updatedData.lokasi = lokasi;
    if (kondisi) updatedData.kondisi = kondisi;
    if (photoPath) updatedData.photo = photoPath;

    // Handle the available field if present
    if (available !== undefined) {
      updatedData.available = Boolean(available); // Convert to boolean
    }

    const updatedBarang = await updateBarang(req.params.id, updatedData);
    res.json(updatedBarang);
  })
);

// Delete a barang by ID
router.delete(
  "/barang/:id",
  asyncHandler(async (req, res) => {
    await deleteBarang(req.params.id);
    res.json({ message: "Barang deleted successfully" });
  })
);

module.exports = router;

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
    const { name, kategoriId, lokasi, kondisi, available } = req.body; // Ensure `kategoriId` is included
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Prefix with "/uploads/"

    const barang = await addBarang({
      name,
      kategoriId: parseInt(kategoriId), // Convert to integer
      lokasi,
      kondisi,
      photo: photoPath, // Store relative URL for the image
      available,
    });
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
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const { name, kategoriId, lokasi, kondisi, available } = req.body; // Ensure `kategoriId` is included
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (kategoriId) updatedData.kategoriId = parseInt(kategoriId); // Convert to integer
    if (lokasi) updatedData.lokasi = lokasi;
    if (kondisi) updatedData.kondisi = kondisi;
    if (available) updatedData.available = available;
    if (photoPath) updatedData.photo = photoPath;

    const barangId = parseInt(req.params.id);
    const updatedBarang = await updateBarang(barangId, updatedData);
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

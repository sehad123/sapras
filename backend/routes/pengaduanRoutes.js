const express = require("express");
const multer = require("multer");
const { createPengaduan, approvePengaduan, trackPengaduan } = require("../services/pengaduanService");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Menyimpan file ke direktori 'uploads'

// Route untuk membuat pengaduan
router.post("/pengaduan", upload.single("photo"), async (req, res) => {
  const { userId, kategori, deskripsi } = req.body;
  const photo = req.file ? req.file.path : null; // Ambil path gambar

  try {
    const pengaduan = await createPengaduan({ userId, kategori, deskripsi, photo });
    res.status(201).json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route untuk menyetujui pengaduan
router.put("/pengaduan/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const pengaduan = await approvePengaduan(id);
    res.json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve pengaduan" });
  }
});

// Route untuk melacak pengaduan berdasarkan userId
router.get("/pengaduan/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const pengaduanHistory = await trackPengaduan(userId);
    res.json(pengaduanHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pengaduan history" });
  }
});

module.exports = router;

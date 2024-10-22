const express = require("express");
const { createPeminjaman, approvePeminjaman, returnBarang, trackPeminjaman } = require("../services/peminjamanService");

const router = express.Router();

router.post("/peminjaman", async (req, res) => {
  const {
    userId,
    barangId,
    startDate,
    endDate,
    startTime, // Tambahkan startTime
    endTime, // Tambahkan endTime
    keperluan,
    kategori,
  } = req.body;

  try {
    const peminjaman = await createPeminjaman({
      userId,
      barangId,
      startDate,
      endDate,
      startTime, // Kirim startTime ke service
      endTime, // Kirim endTime ke service
      keperluan,
      kategori,
    });
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/peminjaman/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const peminjaman = await approvePeminjaman(id);
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve peminjaman" });
  }
});

router.put("/peminjaman/:id/kembali", async (req, res) => {
  const { id } = req.params;
  try {
    const peminjaman = await returnBarang(id);
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to return barang" });
  }
});

router.get("/peminjaman/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const peminjaman = await trackPeminjaman(userId);
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch peminjaman" });
  }
});

module.exports = router;

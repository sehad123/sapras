const express = require("express");
const { createPeminjaman, approvePeminjaman, returnBarang, trackPeminjaman } = require("../services/peminjamanService");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // Inisialisasi Prisma di sini
const router = express.Router();

router.post("/peminjaman", async (req, res) => {
  const { userId, barangId, startDate, endDate, startTime, endTime, keperluan, kategori, nama_kegiatan } = req.body;

  try {
    // Fetch user once in the route
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Pass all necessary data to the service, parsing barangId to integer
    const peminjaman = await createPeminjaman({
      userId,
      barangId: parseInt(barangId, 10), // Ensure barangId is parsed to an integer
      startDate,
      endDate,
      startTime,
      endTime,
      keperluan,
      kategori,
      nama_kegiatan,
      nama_peminjam: user.name,
      role_peminjam: user.role,
    });

    res.status(201).json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/peminjaman/:id/approve", async (req, res) => {
  try {
    const peminjaman = await approvePeminjaman(parseInt(req.params.id)); // Parse id di sini untuk efisiensi
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve peminjaman" });
  }
});

// Backend route for handling "Kembalikan" action
router.put("/peminjaman/:id/kembali", async (req, res) => {
  try {
    const peminjaman = await returnBarang(parseInt(req.params.id)); // Using the service you provided
    res.json(peminjaman); // Return the updated peminjaman object
  } catch (error) {
    res.status(500).json({ error: "Failed to return barang" });
  }
});

router.get("/peminjaman/user/:userId", async (req, res) => {
  try {
    const peminjaman = await trackPeminjaman(parseInt(req.params.userId));
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch peminjaman" });
  }
});

module.exports = router;

const express = require("express");
const { createPeminjaman, getAllPeminjaman, approvePeminjaman, returnBarang, trackPeminjaman, rejectPeminjaman, countPendingPeminjaman } = require("../services/peminjamanService");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // Inisialisasi Prisma di sini
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder penyimpanan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file dengan timestamp
  },
});

const upload = multer({ storage: storage });

router.post("/peminjaman", upload.single("bukti_persetujuan"), async (req, res) => {
  const { userId, barangId, startDate, endDate, startTime, endTime, keperluan, kategori, nama_kegiatan } = req.body;

  // Ambil nama file dari req.file dan validasi file
  const bukti_persetujuan = req.file ? req.file.filename : null;

  console.log("Uploaded file:", req.file); // Logging untuk memastikan file diterima

  try {
    // Validasi userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) }, // Pastikan userId adalah integer
      select: {
        name: true,
        role: true,
      },
    });

    // Validasi user
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Call the service to create a new peminjaman record
    const peminjaman = await createPeminjaman({
      userId: parseInt(userId, 10), // Pastikan userId adalah integer
      barangId: parseInt(barangId, 10),
      startDate,
      endDate,
      startTime,
      endTime,
      keperluan,
      kategori,
      nama_kegiatan,
      nama_peminjam: user.name,
      role_peminjam: user.role,
      bukti_persetujuan, // Menggunakan nama variabel yang konsisten
    });

    // Jika berhasil, kirimkan response
    res.status(201).json(peminjaman);
  } catch (error) {
    // Logging error untuk debugging
    console.error("Error in creating peminjaman:", error);
    res.status(500).json({ error: "An error occurred while creating peminjaman" });
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
router.put("/peminjaman/:id/reject", async (req, res) => {
  try {
    const peminjaman = await rejectPeminjaman(parseInt(req.params.id)); // Parse id di sini untuk efisiensi
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

router.get("/peminjaman", async (req, res) => {
  try {
    const peminjamanList = await getAllPeminjaman();
    res.status(200).json(peminjamanList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route baru untuk menghitung jumlah peminjaman yang masih pending
router.get("/peminjaman/count/pending", async (req, res) => {
  try {
    const pendingCount = await countPendingPeminjaman(); // Menggunakan service untuk menghitung peminjaman pending
    res.status(200).json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pending peminjaman" });
  }
});

module.exports = router;

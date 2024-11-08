const express = require("express");
const {
  createPeminjaman,
  getAllPeminjaman,
  approvePeminjaman,
  returnBarang,
  trackPeminjaman,
  rejectPeminjaman,
  countPendingPeminjaman,
  countDipinjamPeminjaman,
  countDitolakPeminjaman,
  countDikembalikanPeminjaman,
  countPeminjamanWithCatatan,
  pencetNotifikasi,
  trackPeminjamanNotifikasi,
} = require("../services/peminjamanService");
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

router.put("/peminjaman/:id/kembali", upload.single("bukti_pengembalian"), async (req, res) => {
  try {
    console.log("File yang diunggah:", req.file); // Debug file upload
    const { id } = req.params;
    const buktiPengembalianPath = req.file ? req.file.filename : null;

    if (!buktiPengembalianPath) {
      return res.status(400).json({ error: "File bukti pengembalian tidak diunggah." });
    }

    // Panggil fungsi returnBarang dan log hasilnya
    const peminjaman = await returnBarang(parseInt(id), buktiPengembalianPath);
    console.log("Peminjaman berhasil diperbarui:", peminjaman);

    res.json(peminjaman);
  } catch (error) {
    console.error("Error mengembalikan barang:", error); // Tambahkan log error
    res.status(500).json({ error: "Failed to return barang", details: error.message });
  }
});

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

// Route to approve peminjaman
router.put("/peminjaman/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan } = req.body; // Retrieve catatan from request body

    // Pass id and catatan to the approvePeminjaman service
    const peminjaman = await approvePeminjaman(parseInt(id), catatan);
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve peminjaman" });
  }
});

// Route to reject peminjaman
router.put("/peminjaman/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan } = req.body; // Retrieve catatan from request body

    // Pass id and catatan to the rejectPeminjaman service
    const peminjaman = await rejectPeminjaman(parseInt(id), catatan);
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to reject peminjaman" });
  }
});

// Backend route for handling "Kembalikan" action

router.get("/peminjaman/user/:userId", async (req, res) => {
  try {
    const peminjaman = await trackPeminjaman(parseInt(req.params.userId));
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch peminjaman" });
  }
});

router.get("/peminjaman/user/:userId/notif", async (req, res) => {
  try {
    const peminjaman = await trackPeminjamanNotifikasi(parseInt(req.params.userId));
    res.json(peminjaman);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch peminjaman" });
  }
});

router.put("/peminjaman/user/:userId/notifikasi", async (req, res) => {
  try {
    // Mengambil userId dari parameter dan memanggil fungsi pencetNotifikasi untuk mengubah status notifikasi
    const peminjaman = await pencetNotifikasi(parseInt(req.params.userId));
    res.json(peminjaman); // Mengembalikan hasil peminjaman yang sudah diperbarui
  } catch (error) {
    // Menampilkan error jika gagal memperbarui notifikasi
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

router.get("/peminjaman/user/:userId/count", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "User ID tidak valid" });
    }

    // Memanggil fungsi countPeminjamanWithCatatan
    const count = await countPeminjamanWithCatatan(userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch peminjaman count" });
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
router.get("/peminjaman/count/approved", async (req, res) => {
  try {
    const pendingCount = await countDipinjamPeminjaman(); // Menggunakan service untuk menghitung peminjaman pending
    res.status(200).json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pending peminjaman" });
  }
});
router.get("/peminjaman/count/reject", async (req, res) => {
  try {
    const pendingCount = await countDitolakPeminjaman(); // Menggunakan service untuk menghitung peminjaman pending
    res.status(200).json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pending peminjaman" });
  }
});
router.get("/peminjaman/count/dikembalikan", async (req, res) => {
  try {
    const pendingCount = await countDikembalikanPeminjaman(); // Menggunakan service untuk menghitung peminjaman pending
    res.status(200).json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pending peminjaman" });
  }
});

module.exports = router;

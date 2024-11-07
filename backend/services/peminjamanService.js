const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const createPeminjaman = async ({ userId, barangId, startDate, endDate, startTime, endTime, keperluan, kategori, nama_kegiatan, bukti_persetujuan }) => {
  // Pastikan barangId diubah menjadi integer
  const parsedBarangId = parseInt(barangId, 10);

  // Buat peminjaman baru dengan data yang diterima
  const peminjaman = await prisma.peminjaman.create({
    data: {
      userId,
      barangId: parsedBarangId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      keperluan,
      kategori,
      nama_kegiatan,
      bukti_pengembalian: "",
      catatan: "",
      status: "PENDING",
      bukti_persetujuan, // Simpan path file bukti persetujuan
    },
  });

  return peminjaman;
};

const approvePeminjaman = async (id, catatan) => {
  // Mulai transaksi agar update peminjaman dan barang terjadi bersamaan
  const transaction = await prisma.$transaction(async (prisma) => {
    // Update status peminjaman menjadi "APPROVED"
    const peminjaman = await prisma.peminjaman.update({
      where: { id },
      data: { status: "APPROVED", catatan: catatan },
    });

    if (!peminjaman) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Update barang yang dipinjam, set kolom 'available' menjadi 'Tidak'
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { available: "Tidak" },
    });

    return peminjaman;
  });

  return transaction;
};
const rejectPeminjaman = async (id, catatan) => {
  const peminjaman = await prisma.peminjaman.update({
    where: { id },
    data: { status: "REJECTED", catatan: catatan },
  });

  if (!peminjaman) {
    throw new Error("Peminjaman tidak ditemukan");
  }

  return peminjaman;
};

const returnBarang = async (id, buktiPengembalian) => {
  try {
    // Cek apakah peminjaman dengan ID tersebut ada
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
    });

    if (!peminjaman) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Update record peminjaman dengan status "DIKEMBALIKAN" dan bukti_pengembalian
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data: {
        status: "DIKEMBALIKAN",
        bukti_pengembalian: buktiPengembalian, // Pastikan kolom ini sesuai dengan nama di database
      },
    });

    // Pastikan barangId ada di record peminjaman
    if (!peminjaman.barangId) {
      throw new Error("barangId tidak ditemukan pada peminjaman");
    }

    // Update barang agar status ketersediaannya kembali tersedia
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { available: "Ya" },
    });

    // Kembalikan data peminjaman yang sudah diperbarui
    return updatedPeminjaman;
  } catch (error) {
    console.error("Error di returnBarang:", error.message);
    throw new Error("Gagal mengembalikan barang: " + error.message);
  }
};

// Example query in your service to fetch peminjaman with the associated barang name
const trackPeminjaman = async (userId) => {
  const peminjaman = await prisma.peminjaman.findMany({
    where: { userId },
    include: {
      barang: {
        // Include related barang data
        select: { name: true }, // Select only the 'name' field from barang
      },
    },
    orderBy: {
      createdAt: "desc", // Mengurutkan berdasarkan 'createdAt' secara menurun
    },
  });

  if (!peminjaman.length) {
    throw new Error("Peminjaman tidak ditemukan untuk user ini");
  }

  return peminjaman;
};

// Fetch all peminjaman data, including related barang and user information
const getAllPeminjaman = async () => {
  const peminjamanList = await prisma.peminjaman.findMany({
    include: {
      barang: {
        select: { name: true }, // Select the 'name' field from barang
      },
      user: {
        select: { name: true, email: true, role: true }, // Select the 'name' and 'email' fields from the user
      },
    },
    orderBy: {
      createdAt: "desc", // Mengurutkan berdasarkan 'createdAt' secara menurun
    },
  });

  if (!peminjamanList.length) {
    throw new Error("Belum ada data peminjaman");
  }

  return peminjamanList;
};

const countPendingPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "PENDING",
    },
  });

  return pendingCount;
};

const countDipinjamPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "APPROVED",
    },
  });

  return pendingCount;
};

const countDitolakPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "REJECTED",
    },
  });

  return pendingCount;
};

const countDikembalikanPeminjaman = async () => {
  const pendingCount = await prisma.peminjaman.count({
    where: {
      status: "DIKEMBALIKAN",
    },
  });

  return pendingCount;
};

const countApprovedPeminjaman = async (userId) => {
  const approvedCount = await prisma.peminjaman.count({
    where: {
      status: "APPROVED",
      userId: userId, // Filter berdasarkan userId
    },
  });
  return approvedCount;
};

const countRejectPeminjaman = async (userId) => {
  const rejectedCount = await prisma.peminjaman.count({
    where: {
      status: "REJECTED",
      userId: userId, // Filter berdasarkan userId
    },
  });
  return rejectedCount;
};

module.exports = {
  createPeminjaman,
  countDikembalikanPeminjaman,
  countDipinjamPeminjaman,
  countRejectPeminjaman,
  countDitolakPeminjaman,
  rejectPeminjaman,
  countApprovedPeminjaman,
  countRejectPeminjaman,
  countPendingPeminjaman,
  getAllPeminjaman,
  approvePeminjaman,
  returnBarang,
  trackPeminjaman,
};

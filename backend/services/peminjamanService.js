const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const createPeminjaman = async ({ userId, barangId, startDate, endDate, startTime, endTime, keperluan, kategori, nama_kegiatan, nama_peminjam, role_peminjam, bukti_persetujuan }) => {
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
      nama_peminjam,
      role_peminjam,
      status: "PENDING",
      bukti_persetujuan, // Simpan path file bukti persetujuan
    },
  });

  return peminjaman;
};

const approvePeminjaman = async (id) => {
  // Mulai transaksi agar update peminjaman dan barang terjadi bersamaan
  const transaction = await prisma.$transaction(async (prisma) => {
    // Update status peminjaman menjadi "APPROVED"
    const peminjaman = await prisma.peminjaman.update({
      where: { id },
      data: { status: "APPROVED" },
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
const rejectPeminjaman = async (id) => {
  const peminjaman = await prisma.peminjaman.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  if (!peminjaman) {
    throw new Error("Peminjaman tidak ditemukan");
  }

  return peminjaman;
};

const returnBarang = async (id) => {
  const peminjaman = await prisma.peminjaman.update({
    where: { id },
    data: { status: "DIKEMBALIKAN" },
  });

  if (!peminjaman) {
    throw new Error("Peminjaman tidak ditemukan");
  }

  // Update barang setelah dikembalikan
  await prisma.barang.update({
    where: { id: peminjaman.barangId },
    data: { available: "Ya" },
  });

  return peminjaman;
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
        select: { name: true, email: true }, // Select the 'name' and 'email' fields from the user
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
module.exports = { createPeminjaman, rejectPeminjaman, countPendingPeminjaman, getAllPeminjaman, approvePeminjaman, returnBarang, trackPeminjaman };

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
  const peminjaman = await prisma.peminjaman.update({
    where: { id },
    data: { status: "APPROVED" },
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

module.exports = { createPeminjaman, approvePeminjaman, returnBarang, trackPeminjaman };

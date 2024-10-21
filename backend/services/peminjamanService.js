const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPeminjaman = async ({ userId, barangId, startDate, endDate }) => {
  const barang = await prisma.barang.findUnique({ where: { id: barangId } });
  if (!barang || !barang.available) {
    throw new Error("Barang tidak tersedia");
  }

  const peminjaman = await prisma.peminjaman.create({
    data: {
      userId,
      barangId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "PENDING",
    },
  });

  await prisma.barang.update({
    where: { id: barangId },
    data: { available: false },
  });

  return peminjaman;
};

const approvePeminjaman = async (id) => {
  return await prisma.peminjaman.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
};

const returnBarang = async (id) => {
  const peminjaman = await prisma.peminjaman.update({
    where: { id: parseInt(id) },
    data: { status: "DIKEMBALIKAN" },
  });

  await prisma.barang.update({
    where: { id: peminjaman.barangId },
    data: { available: true },
  });

  return peminjaman;
};

const trackPeminjaman = async (userId) => {
  return await prisma.peminjaman.findMany({
    where: { userId: parseInt(userId) },
    include: { barang: true },
  });
};

module.exports = { createPeminjaman, approvePeminjaman, returnBarang, trackPeminjaman };

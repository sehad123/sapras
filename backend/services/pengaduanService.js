const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Service untuk membuat pengaduan
const createPengaduan = async ({ userId, kategori, deskripsi, photo }) => {
  const currentTime = new Date();
  const jam = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

  const pengaduan = await prisma.pengaduan.create({
    data: {
      userId,
      kategori,
      jam, // Simpan jam saat ini
      deskripsi,
      date: currentTime, // Tanggal saat ini
      photo, // Simpan path gambar
      status: "PENDING", // Status default
    },
  });

  return pengaduan;
};

// Service untuk menyetujui pengaduan
const approvePengaduan = async (id) => {
  return await prisma.pengaduan.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
};

// Service untuk melacak pengaduan berdasarkan userId
const trackPengaduan = async (userId) => {
  return await prisma.pengaduan.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: "desc" }, // Urutkan berdasarkan tanggal terbaru
  });
};

module.exports = { createPengaduan, approvePengaduan, trackPengaduan };

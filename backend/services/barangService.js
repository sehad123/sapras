const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new barang
const addBarang = async ({ name, kategoriId, lokasi, kondisi, photo, available }) => {
  // Check for valid values and handle missing/undefined values
  return prisma.barang.create({
    data: {
      name: name || "", // Ensure name is not undefined/null
      kategoriId, // Use the provided kategoriId
      lokasi: lokasi || "", // Set default value if lokasi is missing
      kondisi: kondisi || "", // Set default value if kondisi is missing
      available: available || "", // Set default value if available is missing
      photo: photo || null, // Ensure photo is either a valid path or null
    },
  });
};

// Read all barang
const getAllBarang = async () =>
  prisma.barang.findMany({
    include: { kategori: true }, // Include kategori for more detailed response
  });

const getAvailableBarang = async (kategoriId) => {
  const filter = {
    available: "Ya", // Filter for available barang
  };

  // If kategoriId is provided, add it to the filter
  if (kategoriId) {
    filter.kategoriId = parseInt(kategoriId);
  }

  return prisma.barang.findMany({
    where: filter,
    include: { kategori: true }, // Include kategori for more detailed response
  });
};
// Read a single barang by ID
const getBarangById = async (id) =>
  prisma.barang.findUnique({
    where: { id: parseInt(id) },
    include: { kategori: true }, // Include kategori for detailed response
  });

// Update a barang
const updateBarang = async (id, data) =>
  prisma.barang.update({
    where: { id: parseInt(id) },
    data,
  });

// Delete a barang
const deleteBarang = async (id) =>
  prisma.barang.delete({
    where: { id: parseInt(id) },
  });

module.exports = { addBarang, getAvailableBarang, getAllBarang, getBarangById, updateBarang, deleteBarang };

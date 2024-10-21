const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new barang
const addBarang = async ({ name, type, lokasi, kondisi, photo, available }) => {
  // Check for valid values and handle missing/undefined values
  return prisma.barang.create({
    data: {
      name: name || "", // Ensure name is not undefined/null
      type: type || "", // Set default value if type is missing
      lokasi: lokasi || "", // Set default value if lokasi is missing
      kondisi: kondisi || "", // Set default value if kondisi is missing
      available: available || "", // Set default value if kondisi is missing
      photo: photo || null, // Ensure photo is either a valid path or null
    },
  });
};

// Read all barang
const getAllBarang = async () => prisma.barang.findMany();

// Read a single barang by ID
const getBarangById = async (id) =>
  prisma.barang.findUnique({
    where: { id: parseInt(id) },
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

module.exports = { addBarang, getAllBarang, getBarangById, updateBarang, deleteBarang };

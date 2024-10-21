const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new barang
const addBarang = async ({ name, type, lokasi, kondisi, photo }) => {
  return prisma.barang.create({
    data: { name, type, lokasi, kondisi, photo }, // Added kondisi and photo
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

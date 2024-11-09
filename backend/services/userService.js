const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Create a new user (already implemented)
const registerUser = async ({ name, email, password, role, no_hp }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, no_hp },
    });
    return newUser;
  } catch (error) {
    throw new Error("User registration failed");
  }
};

// Read all users with role "Pegawai"
const getAllPegawaiUsers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "Pelaksana",
    },
  });
};

// Read a single user by ID
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a user
const updateUser = async (id, { name, email, password, role, no_hp }) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        no_hp,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  return user;
};

module.exports = { registerUser, getAllPegawaiUsers, getUserById, updateUser, deleteUser, loginUser };

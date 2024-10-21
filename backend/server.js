const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const barangRoutes = require("./routes/barangRoutes");
const peminjamanRoutes = require("./routes/peminjamanRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes
app.use(userRoutes);
app.use(barangRoutes);
app.use(peminjamanRoutes);

// Server listening
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

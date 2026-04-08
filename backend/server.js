const express = require("express");
const app = express();

require("dotenv").config();



app.use(express.json());

const path = require("path");

// servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));


// 🔹 PostgreSQL
const pool = require("./db");

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error DB");
  }
});

// 🔹 Mongo
const connectMongo = require("./mongo");
connectMongo();

// 🔹 rutas
const usersRoutes = require("./routes/users");
const servicesRoutes = require("./routes/services");
const appointmentsRoutes = require("./routes/appointments");
const authRoutes = require("./routes/auth");
const pqrsRoutes = require("./routes/pqrs");



console.log("usersRoutes:", usersRoutes);
console.log("servicesRoutes:", servicesRoutes);
console.log("appointmentsRoutes:", appointmentsRoutes);
console.log("authRoutes:", authRoutes);
console.log("pqrsRoutes:", pqrsRoutes);



app.use("/api/users", usersRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pqrs", pqrsRoutes);

// 🔹 servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


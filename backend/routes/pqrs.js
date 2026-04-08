const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// esquema
const pqrsSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  tipo: String,
  mensaje: String,
  estado: { type: String, default: "pendiente" },
  fecha: { type: Date, default: Date.now }
});

const PQRS = mongoose.model("PQRS", pqrsSchema);

// 👉 GET (listar)
router.get("/", async (req, res) => {
  const data = await PQRS.find().sort({ fecha: -1 });
  res.json(data);
});

// 👉 POST (crear)
router.post("/", async (req, res) => {
  try {
    const pqrs = new PQRS(req.body);
    await pqrs.save();
    res.status(201).json(pqrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👉 PUT (actualizar estado)
router.put("/:id", async (req, res) => {
  const updated = await PQRS.findByIdAndUpdate(
    req.params.id,
    { estado: req.body.estado },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
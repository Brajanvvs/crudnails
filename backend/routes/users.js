const express = require("express");
const router = express.Router();

// ejemplo
router.get("/", (req, res) => {
  res.json({ message: "Users OK" });
});

module.exports = router; // 🔥 ESTA LÍNEA ES LA CLAVE
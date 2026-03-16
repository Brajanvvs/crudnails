const router = require("express").Router();
const pool = require("../db");

/* =========================
OBTENER SERVICIOS
========================= */

router.get("/", async (req,res)=>{

try{

const services = await pool.query(
"SELECT * FROM services"
);

res.json(services.rows);

}catch(err){

console.log(err);
res.status(500).json("Error obteniendo servicios");

}

});


/* =========================
CREAR SERVICIO
========================= */

router.post("/", async (req,res)=>{

try{

const {title,price,image} = req.body;

const service = await pool.query(
"INSERT INTO services(title,price,image) VALUES($1,$2,$3) RETURNING *",
[title,price,image]
);

res.json(service.rows[0]);

}catch(err){

console.log(err);
res.status(500).json("Error creando servicio");

}

});


/* =========================
ELIMINAR SERVICIO
========================= */

router.delete("/:id", async (req,res)=>{

try{

const {id} = req.params;

/* borrar citas asociadas */

await pool.query(
"DELETE FROM appointments WHERE service_id=$1",
[id]
);

/* borrar servicio */

await pool.query(
"DELETE FROM services WHERE id=$1",
[id]
);

res.json("Servicio eliminado");

}catch(err){

console.log(err);
res.status(500).json("Error eliminando servicio");

}

});


module.exports = router;
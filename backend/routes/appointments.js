const router = require("express").Router();
const pool = require("../db");

/* =========================
   CREAR CITA
========================= */

router.post("/", async (req, res) => {

    try {

        const { user_id, service_id, day, time } = req.body;

        // verificar si horario ya está ocupado
        const existing = await pool.query(
            "SELECT * FROM appointments WHERE day=$1 AND time=$2 AND status='active'",
            [day, time]
        );

        if(existing.rows.length > 0){
            return res.status(400).json("Ese horario ya está reservado");
        }

        const appointment = await pool.query(
            `INSERT INTO appointments(user_id,service_id,day,time)
             VALUES($1,$2,$3,$4)
             RETURNING *`,
            [user_id, service_id, day, time]
        );

        res.json(appointment.rows[0]);

    } catch (error) {

        console.log(error);
        res.status(500).json("Error creando cita");

    }

});


/* =========================
   VER CITAS DE USUARIO
========================= */

router.get("/user/:id", async (req,res)=>{

    const {id} = req.params;

    const appointments = await pool.query(
        `SELECT appointments.*, services.title
         FROM appointments
         JOIN services ON services.id = appointments.service_id
         WHERE user_id=$1`,
        [id]
    );

    res.json(appointments.rows);

});


/* =========================
   CANCELAR CITA
========================= */

router.delete("/:id", async (req,res)=>{

    const {id} = req.params;

    await pool.query(
        "UPDATE appointments SET status='cancelled' WHERE id=$1",
        [id]
    );

    res.json("Cita cancelada");

});


/* =========================
   VER TODAS LAS CITAS (ADMIN)
========================= */

router.get("/", async (req,res)=>{

    const appointments = await pool.query(
        `SELECT appointments.*, users.name, services.title
         FROM appointments
         JOIN users ON users.id = appointments.user_id
         JOIN services ON services.id = appointments.service_id`
    );

    res.json(appointments.rows);

});

module.exports = router;
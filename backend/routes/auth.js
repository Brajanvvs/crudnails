const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

/* =========================
REGISTER
========================= */

router.post("/register", async (req,res)=>{

try{

const {name,email,password} = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const newUser = await pool.query(
"INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'user') RETURNING id,name,email,role",
[name,email,hashedPassword]
);

res.json(newUser.rows[0]);

}catch(err){

console.log(err);
res.status(500).json({error:"Error registrando usuario"});

}

});


/* =========================
LOGIN
========================= */

router.post("/login", async (req,res)=>{

try{

const {email,password} = req.body;

const user = await pool.query(
"SELECT * FROM users WHERE email=$1",
[email]
);

if(user.rows.length === 0){
return res.status(401).json({error:"Usuario no existe"});
}

const validPassword = await bcrypt.compare(
password,
user.rows[0].password
);

if(!validPassword){
return res.status(401).json({error:"Contraseña incorrecta"});
}

res.json({
id:user.rows[0].id,
name:user.rows[0].name,
email:user.rows[0].email,
role:user.rows[0].role
});

}catch(err){

console.log(err);
res.status(500).json({error:"Error login"});

}

});

module.exports = router;
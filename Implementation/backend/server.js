import express from "express";
import mysql from "mysql2";

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventory"
})

app.use(express.json())

app.post("/", (req,res) => {
   const q = "INSERT INTO employees(username,password,profile_picture,position,department,immediate_supervisor) VALUES (?)";
   const values = [
    req.body.username,
    req.body.password,
    req.body.profile_picture,
    req.body.position,
    req.body.department,
    req.body.immediate_supervisor
   ];
   db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Employee successfully added")
   });
})

app.get("/",(req,res) => {
    const q = "SELECT * FROM employees";
    db.query(q,(err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(5500, () => {
    console.log("Connected to backend")
})
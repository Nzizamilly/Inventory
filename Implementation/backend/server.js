import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express()
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventory"
});

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

app.put("/employee/:id", (req,res) => {
    const empID = req.params.id;
    const q = "UPDATE employees SET `username`= ?, `position`= ?, `department`= ?, `immediate_supervisor`= ? WHERE id = ?";
    const values = [
     req.body.username,
     req.body.position,
     req.body.department,
     req.body.immediate_supervisor
    ];
    db.query(q, [...values, empID], (err, data) => {
     if (err) {
        console.error("Error updating: ", err);
        return res.status(500).json({error: "Internal Server Error"})
     }
     console.log("Employee Update Successfully", data);
     return res.json(data)
    });
 })

app.get("/employee",(req,res) => {
    const q = "SELECT * FROM employees";
    db.query(q,(err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/login', (req, res)=>{
    const sql = "SELECT * FROM employees WHERE username = ? and password = ?";
    db.query(sql, [req.body.username, req.body.password], (err, result) => {
        if(err) return res.json({Message: "Error inside server"})
        if(result.length > 0){
            return res.json({Login: true})
        } else {
            return res.json({Login: false})
        }
    })
})


app.listen(5500, () => {
    console.log("Connected to backend")
})
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express()
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

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

app.get('/', (req,res)=>{
    if(req.session.username){
        return res.json({valid: true, username: req.session.username});
    } else {
        return res.json({valid: false})
    }
})

app.put("/employee/:id", (req,res) => {
    const empID = req.params.id;
    const q = "UPDATE employees SET `username`= ?, `password`= ? WHERE id = ?";
    const values = [
     req.body.username,
     req.body.password,
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

app.get("/employee/:id", (req,res) => {
    const empID = req.params.id;
    const q = ` SELECT
    employees.id,
    employees.username,
    employees.password,
    employees.profile_picture,
    employees.roleID,
    employees.departmentID,
    employees.status,
    role.role_name,
    department.department_name
FROM
    employees
JOIN
    role ON employees.roleID = role.id
JOIN
    department ON employees.departmentID = department.id
WHERE
    employees.id = ?;
`
    db.query(q, [empID],(err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/login', (req, res)=>{
    const sql = "SELECT * FROM employees WHERE username = ? and password = ? ";
    db.query(sql, [req.body.username, req.body.password], (err, result) => {
        if(err) return res.json({Message: "Error inside server"})
        if(result.length > 0){
            const userID = result[0].id;
            const roleID = result[0].roleID;

            req.session.username = result[0].username;
            req.session.user_id = userID;
            req.session.role_id = roleID;
            console.log(req.session.username);
            return res.json({Login: true, username: req.session.username, id: req.session.user_id, roleID: req.session.role_id})
        } else {
            return res.json({Login: false})
        }
    })
})


app.listen(5500, () => {
    console.log("Connected to backend")
})
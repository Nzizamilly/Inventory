const express = require("express")
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

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

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

//-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"]
  },
  debug: true
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("send_message", (msg) => {
    console.log("Here is the message", msg);
  });

  io.on("connect_error", (err) => {
    console.error("Socket.io error", err);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  });
})


//-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/employee", (req, res) => {
  console.log("Post request received");
})

app.post("/add-employee", (req, res) => {
  const roleCheckQuery = "SELECT id FROM role WHERE role_name = ?";
  const departmentCheckQuery = "SELECT id FROM department WHERE department_name = ?";

  // Assuming req.body.role and req.body.department are provided by the client
  db.query(roleCheckQuery, [req.body.role], (roleError, roleResult) => {
    if (roleError) {
      console.error('Error checking role:', roleError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    db.query(departmentCheckQuery, [req.body.department], (deptError, deptResult) => {
      if (deptError) {
        console.error('Error checking department:', deptError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!roleResult.length || !deptResult.length) {
        return res.status(400).json({ error: 'Invalid role or department.' });
      }

      const q =
        "INSERT INTO employees(username, password, roleID, departmentID, status) VALUES (?, ?, ?, ?, ?)";
      const values = [
        req.body.username,
        req.body.password,
        roleResult[0].id,
        deptResult[0].id,
        req.body.status
      ];

      db.query(q, values, (insertError, insertResult) => {
        if (insertError) {
          console.error('Error inserting employee:', insertError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({ message: 'Employee added successfully' });
      });
    });
  });
});

app.post('/add-item', (req, res) => {
  const supplierCheckQuery = 'SELECT id FROM supplier WHERE first_name = ?';
  const categoryCheckQuery = 'SELECT id FROM category WHERE category_name = ?';

  // Assuming req.body.supplier and req.body.category are provided by the client
  db.query(supplierCheckQuery, [req.body.supplier], (supplierError, supplierResult) => {
    if (supplierError) {
      console.error('Error checking supplier:', supplierError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    db.query(categoryCheckQuery, [req.body.category], (categoryError, categoryResult) => {
      if (categoryError) {
        console.error('Error checking category:', categoryError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!supplierResult.length) {
        return res.status(400).json({ error: 'Invalid supplier or category.' });
      }

      const insertQuery =
        'INSERT INTO item(name, state_of_item, depreciation_rate, supplierID, categoryID) VALUES (?, ?, ?, ?, ?)';
      const insertValues = [
        req.body.name,
        req.body.state_of_item,
        req.body.depreciation_rate,
        supplierResult[0].id,
        categoryResult[0].id,
      ];
      
      db.query(insertQuery, insertValues, (insertError, insertResult) => {
        if (insertError) {
          console.error('Error inserting item:', insertError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({ message: 'Item added successfully' });
      });
    });
  });
});



app.get('/', (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username });
  }
  else {
    return res.json({ valid: false })
  }
})

app.put("/employee/:id", (req, res) => {
  const empID = req.params.id;
  const q = "UPDATE employees SET `username`= ?, `password`= ? role = ? department = ? status = ? WHERE id = ?";
  const values = [
    req.body.username,
    req.body.password,
    req.body.role,
    req.body.department,
    req.body.status,
  ];
  db.query(q, [...values, empID], (err, data) => {
    if (err) {
      console.error("Error updating: ", err);
      return res.status(500).json({ error: "Internal Server Error" })
    }
    console.log("Employee Update Successfully", data);
    return res.json(data)
  });
})

app.get("/employee/:id", (req, res) => {
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
  db.query(q, [empID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM employees WHERE username = ? and password = ? ";
  db.query(sql, [req.body.username, req.body.password], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" })
    if (result.length > 0) {
      const userID = result[0].id;
      const roleID = result[0].roleID;

      req.session.username = result[0].username;
      req.session.user_id = userID;
      req.session.role_id = roleID;
      console.log(req.session.username);
      return res.json({ Login: true, username: req.session.username, id: req.session.user_id, roleID: req.session.role_id })
    } else {
      return res.json({ Login: false })
    }
  })
})

app.get('/category', (req, res) => {
  const sql = 'SELECT * FROM category';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});
app.get('/employees', (req, res) => {
  const sql = 'SELECT employees.id, employees.username, employees.password, employees.profile_picture, employees.roleID, employees.departmentID, employees.status, role.role_name, department.department_name FROM employees JOIN role ON employees.roleID = role.id JOIN department ON employees.departmentID = department.id';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/items', (req, res) => {
  const categoryId = req.query.category;

  if (!categoryId) {
    res.status(400).json({ error: 'Category ID is required' });
    return;
  }

  const sql = `
      SELECT 
        item.*,
        category.category_name,
        supplier.first_name
      FROM 
        item
      JOIN 
        category ON item.categoryID = category.id
      JOIN 
        supplier ON item.supplierID = supplier.id
      WHERE 
        item.categoryID = ?`;

  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/number-category', (req, res) => {
  const sql = "SELECT COUNT(*) AS category_count FROM category";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ categoryCount: result[0].category_count });
    }
  });
});

app.get('/number-item', (req, res) => {
  const sql = "SELECT COUNT(*) AS item_count FROM item";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ itemCount: result[0].item_count });
    }
  });
});

app.get('/number-employee', (req, res) => {
  const sql = "SELECT COUNT(*) AS employee_count FROM employees";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ employeeCount: result[0].employee_count });
    }
  });
});

app.get('/number-request', (req, res) => {
  const sql = "SELECT COUNT(*) AS request_count FROM request_employee";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ requestCount: result[0].request_count });
    }
  });
});

app.get('/number-supplier', (req, res) => {
  const sql = "SELECT COUNT(*) AS supplier_count FROM supplier";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ supplierCount: result[0].supplier_count });
    }
  });
});

app.get('/item')

app.listen(5500, () => {
  console.log("Connected to backend")
})
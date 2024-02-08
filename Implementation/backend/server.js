const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventory",
});

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database: ', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

//-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"]
  },
  debug: true
});

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);
  socket.on("Employee_Message_Supervisor(1)", (messageData) => {
    console.log("From employee: to supervisor", messageData);
    io.emit("Employee_Message_Supervisor(2)", [messageData]);
  });

  socket.on("Supervisor_Message_HR(1)", (messageData, supervisorName) => {
    console.log("From supervisor: to HR", messageData, supervisorName);
    io.emit("Supervisor_Message_HR(2)", messageData, supervisorName)
  })

  // socket.on("Supervisor_Message_HR(1)", (messageData) => {
  //   io.emit("Supervisor_Message_HR(2)", ([messageData]))
  // })

  socket.on("HR_Message_Stock(1)", (messageData) => {
    console.log("From HR: to stockManager", messageData);
    io.emit("HR_Message_Stock(2)", messageData)
  })

  socket.on("Stock_Message_Employee(1)", (messageData) => {
    console.log("From HR: to stockManager", messageData);
    io.emit("Stock_Message_Employee(2)", ([messageData]))
  })


  socket.on("Approved_By_Supervisor", (notifications, newstatus) => {
    console.log("Data response from the admin: ", notifications, newstatus)
    io.emit("Approved_By_Supervisor", notifications, newstatus);
  });

  socket.on("Denied", (notifications, newStatus) => {
    console.log("Data response from Admin: ", notifications, newStatus);
    io.emit("Denied", notifications, newStatus);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

server.listen(5001, () => {
  console.log("Socket server is running on http://localhost:5001");
});

//-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Add your routes and other configurations below this line

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

app.post('/add-items', (req, res) => {
  const supplierCheckQuery = 'SELECT id FROM supplier WHERE first_name = ?';
  const categoryId = req.body.category;

  console.log("Category", categoryId);

  db.query(supplierCheckQuery, [req.body.supplier], (supplierError, supplierResults) => {
    if (supplierError) {
      console.error('Error checking supplier:', supplierError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (supplierResults.length === 0) {
      return res.status(400).json({ error: 'Invalid supplier.' });
    }

    const supplierId = supplierResults[0].id;

    console.log("Supplier", supplierId);

    const insertQuery =
      'INSERT INTO item(name, supplierID, categoryID) VALUES (?, ?, ?)';

    const insertValues = [
      req.body.name || null,
      supplierId,
      categoryId || null,
    ];

    db.query(insertQuery, insertValues, (insertError, result) => {
      if (insertError) {
        console.error('Error adding item:', insertError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ message: 'Item added successfully' });
    });
  });
});

app.put("/employee/:id", (req, res) => {
  const empID = req.params.id;
  const roleName = req.body.roleName;
  const departmentName = req.body.departmentName;

  function getRoleId(role) {
    const q = 'SELECT role_name FROM role WHERE id = ?'
    const value = [role];
    db.query(q, value, (error, result) => {
      if (error) {
        console.error("Error: ", error);
      } else {
        console.log("Done", result);
        return result;
      }
    })
  }

  function getDepartmentId(department) {
    const q = 'SELECT department_name FROM department WHERE id = ?'
    const value = [department];
    db.query(q, value, (error, result) => {
      if (error) {
        console.error("Error: ", error);
      } else {
        console.log("Done", result);
        return result;
      }
    })
  }

  const departmentID = getDepartmentId(departmentName);
  const roleID = getRoleId(roleName);

  const q = "UPDATE employees SET `username`= ?, `password`= ?, roleID = ?, departmentID = ?, status = ? WHERE id = ?";
  const values = [
    req.body.username,
    req.body.password,
    roleID,
    departmentID,
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
    }

    // Check if result is not empty
    if (result && result.length > 0) {
      // Send the result back to the client
      res.json({ categoryCount: result[0].category_count });
    } else {
      res.status(500).send("Internal Server Error: No data returned from the database query");
    }
  });
});

app.get('/', (req, res) => {
  // console.log("Session", req.session.username);
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username });
  }
  else {
    return res.json({ valid: false })
  }
})

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

app.post('/category', (req, res) => {
  const q = 'INSERT INTO category (category_name, description) VALUES (?)';
  const values = [
    req.body.category_name,
    req.body.description
  ]
  db.query(q, [values], (err, data) => {
    if (err) {
      console.error("Error Inserting", err);
      return res.status(500).json({ error: "internal server error" })
    } else {
      console.log("Supplier added well", data);
      return res.json(data)
    }
  })
})

app.post('/supplier', (req, res) => {
  const q = 'INSERT INTO supplier (first_name, second_name, address, phone, email, status) VALUES (?)';
  const values = [
    req.body.first_name,
    req.body.second_name,
    req.body.address,
    req.body.phone,
    req.body.email,
    req.body.status
  ]
  db.query(q, [values], (err, data) => {
    if (err) {
      console.error("Error inserting", err);
      return res.status(500).json({ error: "Internal Server Error" })
    } else {
      console.log("Supplier Number added well", data);
      return res.json(data)
    }
  })
})

app.get('/supplier', (req, res) => {
  const q = "SELECT * FROM supplier";
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      res.json(result)
    }
  })
})

app.post('/add-serial-number/:takeItemID', (req, res) => {
  34
  const itemID = req.params.takeItemID;
  const status = 'In';
  console.log("Status is: ", status);
  const q = "INSERT INTO serial_number (serial_number, state_of_item, depreciation_rate, itemID, status, taker, quantity ) VALUES (?,?,?,?,?,NULL,1)";
  const values = [
    req.body.serial_number,
    req.body.state_of_item,
    req.body.depreciation_rate,
    itemID,
    status
  ]
  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Error inserting", err);
      return res.status(500).json({ error: "Internal Server Error" })
    }
    console.log("Serial number added well", data)
    return res.json(data)
  });

});

app.get('/serial-number/:itemID', (req, res) => {
  const itemID = req.params.itemID;

  const q1 = `
    SELECT
      item.name AS itemName
    FROM
      serial_number
    JOIN
      item ON serial_number.itemId = item.id
    WHERE
      serial_number.itemId = ?;
  `;

  const q2 = `
    SELECT
      serial_number,
      state_of_item,
      date
    FROM
      serial_number
    WHERE
      itemId = ?;
  `;

  db.query(q1, [itemID], (err, result1) => {
    if (err) {
      console.error('Error fetching item name:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Check if result1 has rows before accessing them
    if (result1 && result1.length > 0) {
      const itemName = result1[0].itemName;

      db.query(q2, [itemID], (err, result2) => {
        if (err) {
          console.error('Error fetching serial numbers:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const serialNumbers = result2;

        res.json({
          itemName: { itemName },
          serialNumbers: { serialNumbers },
          totalSerialCount: serialNumbers.length,
        });
      });
    } else {
      // Handle the case where result1 is empty
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

app.get('/get-serial-number/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const q = 'SELECT * FROM serial_number WHERE itemID = ?';
  const values = [
    itemID
  ];
  db.query(q, [values], (err, result) => {
    if (err) {
      console.error('Error fetching item : ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    return res.json(result)
  })
})

app.get('/get-name-serial-number/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const q = `
  SELECT
    serial_number.*,
    item.name AS itemName
  FROM
    serial_number
  JOIN
    item ON serial_number.itemID = item.id
  WHERE
    serial_number.itemID = ?;
`;
  const values = [
    itemID
  ]
  db.query(q, [values], (err, result) => {
    if (err) {
      console.error('Error fetching item: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    return res.json(result);
  })
})

app.put('/update-item/:id', (req, res) => {
  const id = req.params.id;
  const newItemName = req.body.newItemName;
  const newSupplierName = req.body.newSupplierName;
  const newCategoryName = req.body.newCategoryName;

  // Step 1: Retrieve supplierID
  db.query('SELECT id FROM supplier WHERE first_name = ?', [newSupplierName], (err1, supplierResult) => {
    if (err1) {
      console.error('Error retrieving supplierID:', err1);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (supplierResult.length === 0) {
      // Supplier not found
      console.error('Supplier not found.');
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const supplierID = supplierResult[0].id;

    // Step 2: Retrieve categoryID
    db.query('SELECT id FROM category WHERE category_name = ?', [newCategoryName], (err2, categoryResult) => {
      if (err2) {
        console.error('Error retrieving categoryID:', err2);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (categoryResult.length === 0) {
        // Category not found
        console.error('Category not found.');
        return res.status(404).json({ error: 'Category not found' });
      }

      const categoryID = categoryResult[0].id;

      // Step 3: Update item table
      const updateQuery = 'UPDATE item SET name = ?, supplierID = ?, categoryID = ? WHERE id = ?';
      const updateValues = [newItemName, supplierID, categoryID, id];

      db.query(updateQuery, updateValues, (err3) => {
        if (err3) {
          console.error('Error updating item:', err3);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Item updated successfully' });
      });
    });
  });
});


app.delete('/delete-item/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const q = `DELETE FROM item WHERE id = ?`;
  db.query(q, [itemID], (err, result) => {
    if (err) {
      console.error("Error", err);
    } else {
      console.log("Result :", result);
      return result;
    }
  })
})

app.put('/update-serial-item/:id', (req, res) => {
  const id = req.params.id;
  console.log("ID: ", id);
  const q = `UPDATE serial_number SET serial_number = ?, state_of_item = ?, depreciation_rate = ? WHERE id = ?`;
  const values = [
    req.body.serial_number,
    req.body.state_of_item,
    req.body.depreciation_rate,
    id
  ];

  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error :", error);
    } else {
      console.log("Done right")
      return result
    }
  })

})

app.delete('/delete-serial-item/:id', (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM serial_number WHERE id = ?`;
  db.query(q, [id], (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      console.log("Done well", result)
      // return result;
    }
  })
})

app.put('/deactivate-employee/:id', (req, res) => {
  const id = req.params.id;
  const q = `UPDATE employees SET status = ? WHERE id = ?`;
  const values = [
    req.body.inactive,
    id
  ]
  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      console.log("Done did: ", result);
      return result;
    }
  });
});

app.delete('/delete-employee/:id', (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM employees WHERE id = ?`;

  db.query(q, id, (error, result) => {
    if (error) {
      console.error("Error ", error)
    } else {
      console.log("Done", result)
      return result
    }
  })
})

app.get('/items/:categoryID', (req, res) => {
  const categoryID = req.params.categoryID;
  console.log("CategoryID: ", categoryID);
  const q = 'SELECT * FROM item WHERE categoryID = ?';
  db.query(q, categoryID, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      return res.json(result);
    }
  })
})

app.get('/serial-number', (req, res) => {
  const q = 'SELECT * FROM serial_number';
  db.query(q, categoryID, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      return res.json(result);
    }
  })
})

app.get('/get-total-number/:id', (req, res) => {
  const id = req.params.id;
  console.log('ID: ', id);
  const q = `SELECT * FROM serial_number WHERE itemID = ?`;
  db.query(q, id, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json({ totalCount: result.length });
    }
  })

})

app.put('/update-serial-status/:id/:status', (req, res) => {
  const id = req.params.id
  const status = req.params.status
  console.log("Status: ", status);
  console.log("ID: ", id);
  const q = `UPDATE serial_number set status = ? WHERE id = ?`;
  const values = [status, id]
  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      return result;
    }
  })
})

app.put('/update-serial-status/:id/:status/:taker', async (req, res) => {
  const id = req.params.id
  const status = req.params.status
  const taker = req.params.taker
  console.log("Status: ", status);
  console.log("ID: ", id);
  console.log("Taker Name: ", taker);

  const getEmployeeID = (id) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT id FROM employees WHERE username = ?`;
      const value = [id];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("error", error);
          reject(error);
        } else {
          console.log("Result", result);
          resolve(result);
        }
      });
    });
  };

  try {
    const result = await getEmployeeID(taker);
    const takerID = result[0].id;
    console.log("Taker ID: ", takerID);

    if (takerID !== null) {
      const updateQuery = `UPDATE serial_number SET status = ?, taker = ?, quantity = GREATEST(quantity - 1, 0) WHERE id = ?`;
      const updateValues = [status, takerID, id];

      db.query(updateQuery, updateValues, (error, updateResult) => {
        if (error) {
          console.error("Error", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Update Result", updateResult);
          res.status(200).json({ message: "Update successful" });
        }
      });
    } else {
      res.status(404).json({ error: "Taker not found" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// app.get('/get-serial-status/:id'

app.get('/monthly-report', (req, res) => {
  const query = `
  SELECT
  DATE_FORMAT(serial_number.date, '%d-%m-%Y') AS month,
  item.name AS item_name,
  SUM(CASE WHEN serial_number.status = 'In' THEN 1 ELSE 0 END) AS amount_entered,
  SUM(CASE WHEN serial_number.status = 'Out' THEN 1 ELSE 0 END) AS amount_went_out,
  employees.username AS taker_name,
  (SELECT COUNT(*) FROM serial_number s WHERE s.status = 'In' AND s.itemID = item.id) AS total_items_in
FROM serial_number
JOIN item ON serial_number.itemID = item.id
LEFT JOIN employees ON serial_number.taker = employees.id
GROUP BY month, item_name, taker_name, item.id
ORDER BY serial_number.date DESC;




  `;
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      res.json(result);
    }
  })
})

app.post('/add-department', (req, res) => {
  const q = 'INSERT INTO department(department_name, status) VALUES (?,?)';
  const values = [
    req.body.department_name,
    req.body.status
  ]
  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      console.log("Done Well");
      return result;
    }
  })
})

app.post('/add-role/:deptID', async (req, res) => {
  try {
    const gotDepartmentName = req.params.deptID;
    console.log("DeptID", gotDepartmentName);
    const q = "INSERT INTO role(role_name, departmentID, status) VALUES(?, ?, ?)";
    const values = [req.body.role_name, gotDepartmentName, req.body.status];
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error", err);
      } else {
        // console.log(data);
        res.status(200).send("Role successfully inserted");
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.get('/get-department', (req, res) => {
  const q = 'SELECT * FROM department;';
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      // console.log("Data", result);
      return res.json(result)
    }
  })
})

app.get('/employee', (req, res) => {
  const q = 'SELECT * FROM employees';
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      console.log(result)
    }
  })
});

app.get('/get-role/:deptID', (req, res) => {
  const deptID = req.params.deptID;
  const q = `SELECT * FROM role WHERE departmentID = ?`;
  db.query(q, deptID, (error, result) => {
    if (error) {
      console.error("error", error);
    }
    return res.json(result);
  })
})

app.post('/add-request-employee-supervisor', async (req, res) => {
  const getEmployeeID = (employeeName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employees WHERE username = ?`;
      db.query(sql, [employeeName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const employeeID = result.length > 0 ? result[0].id : null;
          // console.log("Employee ID", employeeID);
          resolve(employeeID);
        }
      });
    });
  };

  const getItemID = (itemName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM item WHERE name = ?`;
      db.query(sql, [itemName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const itemID = result.length > 0 ? result[0].id : null;
          // console.log("Item ID", itemID);
          resolve(itemID);
        }
      });
    });
  };

  const getCategoryID = (categoryName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM category WHERE category_name = ?`;
      db.query(sql, [categoryName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const categoryName = result.length > 0 ? result[0].id : null;
          // console.log("Item ID", categoryName);
          resolve(categoryName);
        }
      });
    });
  }

  try {
    const gotEmployeeName = req.body.employeeName;
    const employeeID = await getEmployeeID(gotEmployeeName);
    // console.log("Employee ID: ", employeeID);

    const gotItemName = req.body.itemName;
    const itemID = await getItemID(gotItemName);
    // console.log("Item ID: ", itemID);

    const gotCategoryName = req.body.categoryName;
    const categoryID = await getCategoryID(gotCategoryName);
    // console.log("Category ID: ", categoryID);

    const status = 'Pending'

    const q =
      "INSERT INTO employee_supervisor_request (categoryID,	itemID,	employeeID,	description,	date_of_request,	status,	amount	) VALUES (?, ?, ?, ?, ?, ?, ? )";
    const values = [categoryID, itemID, employeeID, req.body.description, req.body.date, status, req.body.count];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        id = data.insertId;
        // console.log("This is the id ", id);
        return id;
        // res.status(200).send("Request successfully inserted");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/get-request-employee-supervisor', async (req, res) => {

  try {

    const q =
      `SELECT
      e.username,
      c.category_name,
      i.name AS itemName,
      esr.description,
      esr.date_of_request AS date,
      esr.status,
      esr.amount
  FROM
      employee_supervisor_request esr
  JOIN
      employees e ON esr.employeeID = e.id
  JOIN
      category c ON esr.categoryID = c.id
  JOIN
      item i ON esr.itemID = i.id;
  ;
  `;

    db.query(q, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("data", data);
        return res.json(data);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.post('/add-request-supervisor-hr/:supervisorID', async (req,res)=>{ 

  const getEmployeeID = (employeeName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employees WHERE username = ?`;
      db.query(sql, [employeeName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const employeeID = result.length > 0 ? result[0].id : null;
          console.log("Employee ID", employeeID);
          resolve(employeeID);
        }
      });
    });
  };

  const getItemID = (itemName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM item WHERE name = ?`;
      db.query(sql, [itemName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const itemID = result.length > 0 ? result[0].id : null;
          console.log("Item ID", itemID);
          resolve(itemID);
        }
      });
    });
  };

  const getCategoryID = (categoryName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM category WHERE category_name = ?`;
      db.query(sql, [categoryName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const categoryName = result.length > 0 ? result[0].id : null;
          console.log("Item ID", categoryName);
          resolve(categoryName);
        }
      });
    });
  }

  try {
    const gotEmployeeName = req.body[0].employeeName;
    const employeeID = await getEmployeeID(gotEmployeeName);
    console.log("Employee ID: ", employeeID);

    const gotItemName = req.body[0].itemName;
    const itemID = await getItemID(gotItemName);
    console.log("Item ID: ", itemID);

    const gotCategoryName = req.body[0].categoryName;
    const categoryID = await getCategoryID(gotCategoryName);
    console.log("Category ID: ", categoryID);

    const status = 'Pending'

    const supervisorID = req.params.supervisorID;

    const q =
    "INSERT INTO supervisor_hr_request (supervisorID,	employeeID,	itemID,	categoryID,	description, date_approved,	amount,	status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )";
    const values = [supervisorID, employeeID, itemID, categoryID, req.body[0].description, req.body[0].date, req.body[0].count, status];
    console.log("Values: ", values);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(data);
        res.status(200).send("Request successfully inserted");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

// app.post('/add-request-hr-stock', (req,res)=>{

//   const getEmployeeID = (employeeName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM employees WHERE username = ?`;
//       db.query(sql, [employeeName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const employeeID = result.length > 0 ? result[0].id : null;
//           console.log("Employee ID", employeeID);
//           resolve(employeeID);
//         }
//       });
//     });
//   };

//   const getItemID = (itemName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM item WHERE name = ?`;
//       db.query(sql, [itemName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const itemID = result.length > 0 ? result[0].id : null;
//           console.log("Item ID", itemID);
//           resolve(itemID);
//         }
//       });
//     });
//   };

//   const getCategoryID = (categoryName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM category WHERE category_name = ?`;
//       db.query(sql, [categoryName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const categoryName = result.length > 0 ? result[0].id : null;
//           console.log("Item ID", categoryName);
//           resolve(categoryName);
//         }
//       });
//     });
//   }

//   const getSupervisorID = (supervisorName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM employees WHERE username = ?`;
//       db.query(sql, [supervisorName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const supervisorID = result.length > 0 ? result[0].id : null;
//           console.log("Supervisor ID", supervisorID);
//           resolve(supervisorID);
//         }
//       });
//     });
//   }

//   try {
//     const gotEmployeeName = req.body[0].employeeName;
//     const employeeID = await getEmployeeID(gotEmployeeName);
//     console.log("Employee ID: ", employeeID);

//     const gotItemName = req.body[0].itemName;
//     const itemID = await getItemID(gotItemName);
//     console.log("Item ID: ", itemID);

//     const gotCategoryName = req.body[0].categoryName;
//     const categoryID = await getCategoryID(gotCategoryName);
//     console.log("Category ID: ", categoryID);

//     const status = 'Pending'

//     const supervisorID = req.params.supervisorID;

//     const q =
//     "INSERT INTO supervisor_hr_request (supervisorID,	employeeID,	itemID,	categoryID,	description, date_approved,	amount,	status	) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )";
//     const values = [supervisorID, employeeID, itemID, categoryID, req.body[0].description, req.body[0].date, req.body[0].count, status];
//     console.log("Values: ", values);

//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//       } else {
//         console.log(data);
//         res.status(200).send("Request successfully inserted");
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }

// })

app.put('/approve-by-supervisor/:index', (req, res) => {
  const id = req.params.index;
  const approve = "Approved";
  const values = [ approve, id ];
  const update1 = "UPDATE employee_supervisor_request set status = ? WHERE id = ?";

  db.query(update1, values, (error, result)=>{
    if(error){
      console.error("Error", error)
    }else{
      console.log("Approved Well !!!");
      return result;
    }
  })
})

app.put('/deny-by-supervisor/:index', (req, res) => {
  const id = req.params.index;
  const approve = "Denied";
  const values = [ approve, id ];
  const update1 = "UPDATE employee_supervisor_request set status = ? WHERE id = ?";

  db.query(update1, values, (error, result)=>{
    if(error){
      console.error("Error", error)
    }else{
      console.log("Denied Well !!!");
      return result;
    }
  })
})

app.get('/get-number', (req, res) => {
  const sql = "SELECT id FROM employee_supervisor_request ORDER BY id DESC LIMIT 1";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Check if there is any result
      if (result.length > 0) {
        const latestId = result[0].id;

        // console.log("Latest ID in employee_supervisor_request table:", latestId);
        return res.json({ latestId });
      } else {
        return res.json({ latestId: null }); // Or handle the case where there is no result
      }
    }
  });
});



app.listen(5500, () => {
  console.log("Connected to backend")
})
const db = require("../../db");

const ASSIGN_TO_SUBADMIN = (req, res) => {
  console.log("Request body:", req.body);

  const { subadminId, appointmentIds } = req.body;

  // Check if both fields are provided
  if (!subadminId || !appointmentIds || !Array.isArray(appointmentIds)) {
    return res
      .status(400)
      .json("Technician ID and Appointment IDs are required!");
  }

  // Loop through all appointment IDs and prepare records for insertion
  const assignments = appointmentIds.map((appointmentId) => [
    appointmentId,
    subadminId,
  ]);

  // SQL query to insert assignments into the database
  const assignSql = `
    INSERT INTO assign_appointment_subadmin (appointment_id, subadmin_id)
    VALUES ?
  `;

  console.log("SQL Query for Insert:", assignSql);
  console.log("Values for Insert:", [assignments]);

  // Execute the query to insert multiple assignments
  db.query(assignSql, [assignments], (err, result) => {
    if (err) {
      console.error("SQL Error on Insert:", err);
      return res
        .status(500)
        .json("Failed to assign technicians to appointments");
    }

    console.log("Insert Result:", result);

    // Update the status of the appointments to "Assigned"
    const updateSql = `
      UPDATE appointment
      SET status = 'Assigned_to_SubAdmin'
      WHERE appointment_id IN (?)
    `;

    console.log("SQL Query for Update:", updateSql);
    console.log("Values for Update:", [appointmentIds]);

    // Execute the query to update the status
    db.query(updateSql, [appointmentIds], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("SQL Error on Update:", updateErr);
        return res
          .status(500)
          .json("Failed to update appointment statuses to 'Assigned'");
      }

      console.log("Update Result:", updateResult);
      return res
        .status(200)
        .json(
          "Technician assigned to appointments and statuses updated successfully"
        );
    });
  });
};

const GET_ALL_SUBADMIN = (req, res) => {
  const sql = "SELECT * FROM subadminmaster";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching Subadmin:", err);
      return res.status(500).json("Failed to fetch Subadmin");
    }
    return res.status(200).json(data);
  });
};

const GET_SUBADMIN_COUNT = (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM subadminmaster";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

// Get Laboratory by ID
const GET_SUBADMIN_BY_ID = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM subadminmaster WHERE subadmin_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching Subadmin:", err);
      return res.status(500).json("Failed to fetch Subadmin");
    }
    if (data.length === 0) {
      return res.status(404).json("Subadmin not found");
    }
    return res.status(200).json(data[0]);
  });
};

// Add New Laboratory
const ADD_SUBADMIN = (req, res) => {
  const {
    name,
    mname,
    lname,
    country,
    state,
    city,
    pincode,
    address,

    mobileno,
    email,
    username,
    password,
  } = req.body;

  console.log("Received request to add laboratory:", req.body); // Log the incoming request

  if (
    !name ||
    !mname ||
    !lname ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !mobileno ||
    !email ||
    !username ||
    !password
  ) {
    console.log("Validation error: All fields are required");
    return res.status(400).json("All fields are required!");
  }


  const subadminSql = `
    INSERT INTO subadminmaster (name, mname, lname, country, state, city, pincode, address, mobileno, email, username, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query for Subadmin:", subadminSql);

  const adminLoginSql = `
    INSERT INTO admin_login (token_key, name, email, username, password, post)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query for admin login:", adminLoginSql);

  // Generate a random token_key
  const tokenKey = Math.random().toString(36).substr(2, 10);
  console.log("Generated token key:", tokenKey);

  // Start a transaction to ensure data consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json("Transaction Error");
    }

    // Insert into the laboratory table
    db.query(
      subadminSql,
      [
        name,
        mname,
        lname,
        country,
        state,
        city,
        pincode,
        address,
        mobileno,
        email,
        username,
        password,
      ],
      (err, labResult) => {
        if (err) {
          console.error("Error adding Subadmin:", err);
          return db.rollback(() => {
            res.status(500).json("Failed to add Subamdin");
          });
        }
        console.log("Subadmin added successfully:", labResult);
        const subadmin_id = labResult.insertId;
        // Insert into the admin_login table
        db.query(
          adminLoginSql,
          [tokenKey, name, email, username, password, "subadmin"],
          (err, adminResult) => {
            if (err) {
              console.error("Error adding admin login:", err);
              return db.rollback(() => {
                res.status(500).json("Failed to add admin login");
              });
            }
            console.log("Admin login added successfully:", adminResult);

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                console.error("Commit Error:", err);
                return db.rollback(() => {
                  res.status(500).json("Failed to commit transaction");
                });
              }

              console.log("Transaction committed successfully");
              res.status(201).json({
                message: "Sub-Admin added successfully",
                subadmin_id: subadmin_id,
              });
            });
          }
        );
      }
    );
  });
};

// Update Laboratory by ID
const UPDATE_SUBADMIN = (req, res) => {
  const { id } = req.params;
  const {
    name,
    mname,
    lname,
    country,
    state,
    city,
    pincode,
    address,

    mobileno,
    email,
    username,
    password,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !name ||
    !mname ||
    !lname ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !mobileno ||
    !email ||
    !username ||
    !password
  ) {
    return res.status(400).json("All fields are required!");
  }

  // Validate pincode
  if (isNaN(pincode) || pincode.length !== 6) {
    return res.status(400).json("Pincode must be a 6-digit number.");
  }

  const sql = `
    UPDATE subadminmaster
    SET name = ?, mname = ?, lname = ?, country = ?, state = ?, city = ?, pincode = ?, address = ?, 
         mobileno = ?, email = ?, username = ?, password = ?
        
    WHERE subadmin_id = ?
  `;

  db.query(
    sql,
    [
      name,
      mname,
      lname,
      country,
      state,
      city,
      pincode,
      address,

      mobileno,
      email,
      username,
      password,

      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating Subadmin:", err);
        return res.status(500).json("Failed to update Subadmin");
      }
      if (result.affectedRows === 0) {
        return res.status(404).json("Subadmin not found");
      }
      return res.status(200).json("Subadmin updated successfully");
    }
  );
};

// Delete Laboratory by ID
const DELETE_SUBADMIN = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM subadminmaster WHERE subadmin_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting Subadmin:", err);
      return res.status(500).json("Failed to delete Subadmin");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("Subadmin not found");
    }
    return res.status(200).json("Subadmin deleted successfully");
  });
};

const GET_ALL_ASSISTANT_FOR_SUBADMIN = (req, res) => {
  const subadmin_id = req.query.subadmin_id; // Get subadmin_id from request query

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No assistant ID provided" });
  }

  const sql = `
    SELECT a.*
  FROM assistant a
  JOIN subadminmaster s ON s.pincode LIKE CONCAT('%', a.pincode, '%')
  WHERE s.subadmin_id = ?;
  
    `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data);
  });
};

const GET_ALL_APPOINTMENT_FOR_SUBADMIN = (req, res) => {
  const subadmin_id = req.query.subadmin_id; // Get subadmin_id from request query

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No assistant ID provided" });
  }

  const sql = `
    SELECT DISTINCT a.*
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Unassigned';
    `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data);
  });
};

const GET_ALL_APPOINTMENT_OD_SUBADMIN_DASHBOARD = (req, res) => {
  const sql = `
    SELECT DISTINCT a.*, ar.*
    FROM appointment a
    LEFT JOIN appointment_replies ar ON a.appointment_no = ar.appointment_nos
    JOIN subadminmaster s 
    ON (
      FIND_IN_SET(a.pincode, s.pincode) 
      OR FIND_IN_SET(s.pincode, a.pincode)
    )
   
    ORDER BY a.time DESC;
    `;

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data);
  });
};

const GET_COUNT_ASSIGN_APPOINTMENT_OF_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query;

  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS total_count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Assigned';
  `;

  console.log("Executing SQL:", sql, [subadmin_id]);

  db.query(sql, [subadmin_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch count", details: err });
    }

    res.json(result[0]?.total_count || 0);
  });
};

const GET_COUNT_UNASSIGN_APPOINTMENT_OF_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query;

  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS total_count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Unassigned';
  `;

  console.log("Executing SQL:", sql, [subadmin_id]);

  db.query(sql, [subadmin_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch count", details: err });
    }

    res.json(result[0]?.total_count || 0);
  });
};

const GET_ALL_APPOINTMENT_BY_SUBADMIN_ID = (req, res) => {
  const { subadmin_id } = req.params;

  if (!subadmin_id) {
    return res.status(400).json({ message: "subadmin_id is required" });
  }

  const sql = `
      SELECT a.* 
      FROM appointment a
      INNER JOIN assign_appointment_subadmin aas ON a.appointment_id = aas.appointment_id
      WHERE aas.subadmin_id = ?
      ORDER BY a.time DESC
    `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch appointments", error: err });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this sub-admin" });
    }

    return res.json(data);
  });
};

const GET_TOTAL_APPOINTMENT_FOR_SUBADMIN = (req, res) => {
  const subadmin_id = req.query.subadmin_id; // Get subadmin_id from request query

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No assistant ID provided" });
  }

  const sql = `
    SELECT DISTINCT a.*, ar.*
FROM appointment a
JOIN subadminmaster s ON FIND_IN_SET(a.pincode, s.pincode) > 0
LEFT JOIN (
    SELECT * FROM appointment_replies
    WHERE appointment_nos IS NOT NULL
    GROUP BY appointment_nos
) ar ON a.appointment_no = ar.appointment_nos
WHERE s.subadmin_id = ?
ORDER BY a.time DESC;

    `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data);
  });
};

const GET_APPOINTMENT_BY_STATUS = (req, res) => {
  const { status } = req.params;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  // Set the condition based on the status value
  let statusCondition;
  if (status === "1") {
    statusCondition = "Assigned";
  } else if (status === "2") {
    statusCondition = "Unassigned";
  } else if (status === "3") {
    statusCondition = "Completed";
  } else if (status === "4") {
    statusCondition = "Submitted";
  } else {
    return res.status(400).json({ message: "Invalid status value" });
  }

  // Ensure the SQL query matches string values
  const sql = "SELECT * FROM appointment WHERE status = ?";
  db.query(sql, [statusCondition], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch appointments by status" });
    }
    if (data.length === 0) {
      return res.status(404).json({
        message: `No appointments found with status ${statusCondition}`,
      });
    }
    res.status(200).send(data);
  });
};

const GET_COUNT_SUBMITTED_APPOINTMENT_OF_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query;

  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS total_count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Submitted';
  `;

  console.log("Executing SQL:", sql, [subadmin_id]);

  db.query(sql, [subadmin_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch count", details: err });
    }

    res.json(result[0]?.total_count || 0);
  });
};

const GET_SUBMITTED_APPOINTMENT_FOR_SUBADMIN = (req, res) => {
  const subadmin_id = req.query.subadmin_id; // Get subadmin_id from request query

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No assistant ID provided" });
  }

  const sql = `
    SELECT DISTINCT a.*
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Submitted';
    `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data);
  });
};

const GET_COMPLETED_APPOINTMENT_FOR_SUBADMIN = (req, res) => {
  const subadmin_id = req.query.subadmin_id; // Get subadmin_id from request query

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No assistant ID provided" });
  }

  const sql = `
    SELECT DISTINCT a.*
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Completed';
    `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data);
  });
};

const GET_STATUS_APPOINTMENT_FOR_SUBADMIN = (req, res) => {
  const { status } = req.params; // Extract status from URL
  const { subadmin_id } = req.query; // Extract subadmin_id from query

  // Debugging log
  console.log("Status:", status, "Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  // Map status values correctly
  let statusCondition;
  if (status === "1") {
    statusCondition = "Assigned";
  } else if (status === "2") {
    statusCondition = "Unassigned";
  } else if (status === "3") {
    statusCondition = "Completed";
  } else if (status === "4") {
    statusCondition = "Submitted";
  } else {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // Query
  const sql = `
    SELECT DISTINCT a.*
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = ?;
  `;

  db.query(sql, [subadmin_id, statusCondition], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    if (data.length === 0) {
      return res.status(404).json({
        message: `No appointments found with status ${statusCondition}`,
      });
    }
    res.json(data);
  });
};

const GET_REJECTED_APPOINTMENTS_FOR_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query; // Extract subadmin_id from query

  // Debugging log
  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // Query to fetch appointments with rejected_status = 1
  const sql = `
    SELECT DISTINCT a.*
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.rejected_status = 1;
  `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    if (data.length === 0) {
      return res.status(404).json({
        message: "No rejected appointments found",
      });
    }
    res.json(data);
  });
};

const GET_TODAYS_SUBADMIN_APPOINTMENTS = (req, res) => {
  const { subadmin_id } = req.query; // Get subadmin_id from query parameters

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // SQL Query
  const sql = `
    SELECT DISTINCT a.*
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Unassigned' AND DATE(a.created_at) = ?;
  `;

  db.query(sql, [subadmin_id, today], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No rejected appointments found for today" });
    }
    res.json(data);
  });
};

const GET_COUNT_APPOINTMENT_OF_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query;

  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS total_count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ?;
  `;

  console.log("Executing SQL:", sql, [subadmin_id]);

  db.query(sql, [subadmin_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch count", details: err });
    }

    res.json(result[0]?.total_count || 0);
  });
};

const GET_NULL_APPOINTMENTS_FOR_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query; // Extract subadmin_id from query

  // Debugging log
  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // Query to fetch appointments with rejected_status = 1
  const sql = `
  SELECT DISTINCT a.*
  FROM appointment a
  JOIN subadminmaster s 
  ON FIND_IN_SET(a.pincode, s.pincode) > 0
  WHERE s.subadmin_id = ?
  AND (a.appointment_no IS NULL 
       OR a.mobileno IS NULL 
       OR a.name IS NULL)
  AND a.status = 'Unassigned';
  
  `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    if (data.length === 0) {
      return res.status(404).json({
        message: "No rejected appointments found",
      });
    }
    res.json(data);
  });
};

const GET_NULL_APPOINTMENT_COUNT_FOR_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query; // Extract subadmin_id from query

  // Debugging log
  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // Query to count unassigned appointments with NULL key fields
  const sql = `
    SELECT COUNT(DISTINCT a.appointment_no) AS total_null_appointments
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ?
    AND (a.appointment_no IS NULL 
         OR a.mobileno IS NULL 
         OR a.name IS NULL)
    AND a.status = 'Unassigned';
  `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch count data" });
    }
    res.json(data[0].total_null_appointments);
  });
};

const GET_REJECTED_APPOINTMENTS_COUNT_FOR_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query; // Extract subadmin_id from query

  console.log("Subadmin ID:", subadmin_id); // Debugging log

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // SQL query to count rejected appointments
  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS rejected_count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.rejected_status = 1;
  `;

  db.query(sql, [subadmin_id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data[0].rejected_count);
  });
};

const GET_TODAYS_SUBADMIN_APPOINTMENTS_COUNT = (req, res) => {
  const { subadmin_id } = req.query; // Get subadmin_id from query parameters

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // SQL Query to get count
  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Unassigned' AND DATE(a.created_at) = ?;
  `;

  db.query(sql, [subadmin_id, today], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(data[0].count);
  });
};

const GET_COUNT_COMPLETED_APPOINTMENT_OF_SUBADMIN = (req, res) => {
  const { subadmin_id } = req.query;

  console.log("Subadmin ID:", subadmin_id);

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  const sql = `
    SELECT COUNT(DISTINCT a.appointment_id) AS total_count
    FROM appointment a
    JOIN subadminmaster s 
    ON FIND_IN_SET(a.pincode, s.pincode) > 0
    WHERE s.subadmin_id = ? AND a.status = 'Completed';
  `;

  console.log("Executing SQL:", sql, [subadmin_id]);

  db.query(sql, [subadmin_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch count", details: err });
    }

    res.json(result[0]?.total_count || 0);
  });
};

module.exports = {
  ASSIGN_TO_SUBADMIN,
  GET_ALL_SUBADMIN,
  GET_SUBADMIN_COUNT,
  GET_SUBADMIN_BY_ID,
  ADD_SUBADMIN,
  UPDATE_SUBADMIN,
  DELETE_SUBADMIN,
  GET_ALL_ASSISTANT_FOR_SUBADMIN,
  GET_ALL_APPOINTMENT_FOR_SUBADMIN,
  GET_ALL_APPOINTMENT_OD_SUBADMIN_DASHBOARD,
  GET_COUNT_ASSIGN_APPOINTMENT_OF_SUBADMIN,
  GET_COUNT_UNASSIGN_APPOINTMENT_OF_SUBADMIN,
  GET_ALL_APPOINTMENT_BY_SUBADMIN_ID,
  GET_TOTAL_APPOINTMENT_FOR_SUBADMIN,
  GET_COUNT_SUBMITTED_APPOINTMENT_OF_SUBADMIN,
  GET_SUBMITTED_APPOINTMENT_FOR_SUBADMIN,
  GET_COMPLETED_APPOINTMENT_FOR_SUBADMIN,
  GET_STATUS_APPOINTMENT_FOR_SUBADMIN,
  GET_REJECTED_APPOINTMENTS_FOR_SUBADMIN,
  GET_TODAYS_SUBADMIN_APPOINTMENTS,
  GET_COUNT_APPOINTMENT_OF_SUBADMIN,
  GET_NULL_APPOINTMENTS_FOR_SUBADMIN,
  GET_NULL_APPOINTMENT_COUNT_FOR_SUBADMIN,
  GET_REJECTED_APPOINTMENTS_COUNT_FOR_SUBADMIN,
  GET_TODAYS_SUBADMIN_APPOINTMENTS_COUNT,
  GET_COUNT_COMPLETED_APPOINTMENT_OF_SUBADMIN,
};

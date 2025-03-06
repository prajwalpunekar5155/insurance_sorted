const db = require("../../db");

const Get_ALL_APPOINTMENT = (req, res) => {
  const sql = `SELECT * from appointment
  ORDER BY time DESC
   `; // Order by time in descending order
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch", error: err });
    }
    return res.json(data);
  });
};

const Get_ALL_APPOINTMENTS = (req, res) => {
  const sql = `
    SELECT a.* 
    FROM appointment a
    LEFT JOIN laboratory l ON a.pincode = l.pincode
    WHERE (a.pincode IS NULL OR l.pincode IS NULL)
    AND a.status = 'Unassigned'
    ORDER BY a.time DESC
    `;

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch", error: err });
    }
    return res.json(data);
  });
};

const GET_TODAY_APPOINTMENT_DASHBOARD = (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const sql = "SELECT * FROM appointment WHERE DATE(created_at) = ?"; // Extract only the date from 'created_at'

  db.query(sql, [today], (err, data) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch today's appointments." });
    }
    return res.json(data);
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
  }
   else {
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

const GET_LATEST_APPOINTMENT = (req, res) => {
  const sql = "SELECT * FROM appointment ORDER BY time DESC LIMIT 5";
  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).json("Fail to fetch appointments");
    }
    return res.json(data); // Send the latest 5 appointments as JSON
  });
};

const GET_APPOINTMENT_COUNT = (req, res) => {
  const sql = "SELECT COUNT(*) AS count FROM appointment";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

// For Assigned appointment
const GET_ASSIGN_COUNT = (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Assigned'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

// For unassigned appointment
const GET_UNASSIGN_COUNT = (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Unassigned'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

const GET_COMPLETED_COUNT = (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Completed'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

const UPDATE_APPOINTMENT = (req, res) => {
  const { id } = req.params;
  const { time, treatment, message } = req.body;

  const sql =
    "UPDATE appointment SET time = ?, treatment = ?, message = ? WHERE appointment_id = ?";

  db.query(sql, [time, treatment, message, id], (err, result) => {
    if (err) {
      console.error("Database error:", err); // More detailed logging here
      return res.status(500).send("Update failed");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Appointment not found");
    }
    res.status(200).send("Update successful");
  });
};

const GET_APPOINTMENT_BY_ID = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM appointment WHERE appointment_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return res.status(500).json("Failed to fetch appointment details");
    }
    if (data.length === 0) {
      return res.status(404).json("Appointment not found");
    }
    res.json(data[0]);
  });
};

const ADD_APPOINTMENT = (req, res) => {
  console.log("Request body:", req.body);

  const {
    name,
    date_,
    time_,
    treatment,
    mobileno,
    appointment_no,
    country,
    state,
    city,
    pincode,
    address,
    insurance_name,
    tpa_details,
  } = req.body;

  if (
    !name ||
    !date_ ||
    !time_ ||
    !treatment ||
    !mobileno ||
    !appointment_no ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address ||
    !insurance_name ||
    !tpa_details
  ) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
    INSERT INTO appointment
    (name, date_, time_, treatment, mobileno, appointment_no, country, state, city, pincode, address, insurance_name, tpa_details) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("SQL Query:", sql);
  console.log("Values:", [
    name,
    date_,
    time_,
    treatment,
    mobileno,
    appointment_no,
    country,
    state,
    city,
    pincode,
    address,
    insurance_name,
    tpa_details,
  ]);

  db.query(
    sql,
    [
      name,
      date_,
      time_,
      treatment,
      mobileno,
      appointment_no,
      country,
      state,
      city,
      pincode,
      address,
      insurance_name,
      tpa_details,
    ],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json("Failed to add appointment");
      }

      console.log("SQL Result:", result);
      return res.status(200).json("Appointment added successfully");
    }
  );
};

//Excel appointments

const PREVIEW_APPOINTMENT = (req, res) => {
  const sql = "SELECT * FROM appointment";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Failed to fetch data");
    }
    return res.json(data); // Send data as JSON for preview
  });
};

const DOWNLOAD_APPOINTMENT = (req, res) => {
  const sql = "SELECT * FROM appointment";
  db.query(sql, async (err, data) => {
    if (err) {
      return res.status(500).json("Failed to fetch data");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Appointments");

    // Define columns
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Client Name", key: "name", width: 30 },
      { header: "Medical Test", key: "treatment", width: 30 },
      { header: "Contact No", key: "mobileno", width: 20 },
      { header: "Proposal No", key: "appointment_no", width: 20 },
      { header: "Appointment Time", key: "time", width: 25 },
    ];

    // Add rows
    data.forEach((appointment) => {
      worksheet.addRow({
        id: appointment.id,
        name: appointment.name,
        treatment: appointment.treatment,
        mobileno: appointment.mobileno,
        appointment_no: appointment.appointment_no,
        time: new Date(appointment.time).toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      });
    });

    // Set header for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=appointments.xlsx"
    );

    // Write Excel to response
    await workbook.xlsx.write(res);
    res.end();
  });
};

const GET_SUBMITTED_APPOINTMENT_COUNT = (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Submitted'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

const GET_APPOINTMENT_BY_PINCODE = (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql = "SELECT * FROM appointment WHERE pincode = ?";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
};

const GET_CENTRE_BY_PINCODE = (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql = "SELECT * FROM laboratory WHERE pincode = ?";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
};

const GET_ASSISTANT_BY_PINCODE = (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql = "SELECT * FROM assistant WHERE pincode = ?";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
};

const APPOINTMENT_FOR_ADMIN_TECHNICIAN = (req, res) => {
  const assistant_id = req.query.assistant_id; // Get assistant_id from request query

  if (!assistant_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No assistant ID provided" });
  }

  // Get the assistant's pincodes
  const getAssistantPincodesSQL = `SELECT pincode FROM assistant WHERE assistant_id = ?`;

  db.query(getAssistantPincodesSQL, [assistant_id], (err, assistantData) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch assistant data" });
    }

    if (assistantData.length === 0) {
      return res.status(404).json({ error: "Assistant not found" });
    }

    const assistantPincodes = assistantData[0].pincode.split(","); // Split to array of pincodes
    console.log("Assistant Pincodes: ", assistantPincodes);

    // Fetch subadmin records where any assistant pincode matches the subadminmaster's pincode
    const getSubadminSQL = `
      SELECT subadmin_id, pincode FROM subadminmaster
      WHERE FIND_IN_SET(?, pincode) > 0
    `;

    db.query(getSubadminSQL, [assistantPincodes[0]], (err, subadminData) => {
      // Check only first pincode for now
      if (err) {
        return res.status(500).json({ error: "Failed to fetch subadmin data" });
      }

      if (subadminData.length === 0) {
        return res.status(404).json({ error: "No matching subadmins found" });
      }

      // Collect all matching pincodes from subadminmaster
      let subadminPincodes = [];

      subadminData.forEach((row) => {
        const subadminPincodeList = row.pincode.split(","); // Multiple pincodes in subadminmaster
        subadminPincodes = [...subadminPincodes, ...subadminPincodeList];
      });

      console.log("Subadmin Pincodes: ", subadminPincodes);

      // Fetch appointments where pincode matches any of the subadminmaster pincodes
      const getAppointmentsSQL = `
        SELECT * FROM appointment
        WHERE FIND_IN_SET(pincode, ?) > 0
        AND status = 'Unassigned'
      `;

      db.query(
        getAppointmentsSQL,
        [subadminPincodes.join(",")],
        (err, appointmentsData) => {
          if (err) {
            console.log("Error fetching appointments: ", err);
            return res
              .status(500)
              .json({ error: "Failed to fetch unassigned appointments" });
          }

          if (appointmentsData.length === 0) {
            return res.json({ message: "No unassigned appointments found" });
          }

          res.json(appointmentsData);
        }
      );
    });
  });
};

const GET_REJECTED_COUNT = (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment where status = 'Unassigned' AND rejected_status='1'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};

const GET_REJECTED_APPOINTMENT = (req, res) => {
  const { pincode } = req.query; // Get the pincode from the query parameter
  const sql =
    "SELECT * FROM appointment WHERE status = 'Unassigned' AND rejected_status='1'";

  db.query(sql, [pincode], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Fail to fetch data" });
    }
    return res.json(data);
  });
};

const GET_NULL_APPOINTMENT_COUNT = (req, res) => {
  const sql =
    "SELECT COUNT(*) AS count FROM appointment WHERE appointment_no IS NULL OR mobileno IS NULL OR pincode IS NULL";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data[0].count); // Send the count of appointments
  });
};


const GET_APPOINTMENTS_WITH_NULL_FIELDS = (req, res) => {
  const sql = `
    SELECT * FROM appointment
    WHERE appointment_no IS NULL
    OR mobileno IS NULL
    OR pincode IS NULL
  `;

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch appointments" });
    }
    return res.json(data);
  });
};

const GET_TODAY_APPOINTMENT_COUNT = (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const sql =
    "SELECT COUNT(*) AS count FROM appointment WHERE DATE(created_at) = ?";

  db.query(sql, [today], (err, data) => {
    if (err) {
      console.error("Error fetching appointment count:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch today's appointment count." });
    }
    return res.json(data[0].count);
  });
};

const GET_COMPLETED_APPOINTMENT = (req, res) => {
  const sql =
    "SELECT * FROM appointment where status = 'Completed'";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json("Fail to fetch appointment count");
    }
    return res.json(data); // Send the count of appointments
  });
};

const APPOINTMENT_FOR_ADMIN_TO_SUBADMIN = (req, res) => {
  const subadmin_id = req.query.subadmin_id; // Fetch subadmin ID from query

  if (!subadmin_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No subadmin ID provided" });
  }

  // Get subadmin's pincodes
  const getSubadminPincodesSQL = `SELECT pincode FROM subadminmaster WHERE subadmin_id = ?`;

  db.query(getSubadminPincodesSQL, [subadmin_id], (err, subadminData) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch subadmin data" });
    }

    if (subadminData.length === 0) {
      return res.status(404).json({ error: "Subadmin not found" });
    }

    const subadminPincodes = subadminData[0].pincode.split(","); // Convert pincodes to array
    console.log("Subadmin Pincodes: ", subadminPincodes);

    // Fetch unassigned appointments for the subadmin's pincodes
    const getAppointmentsSQL = `
      SELECT * FROM appointment
      WHERE FIND_IN_SET(pincode, ?) > 0
      AND status = 'Unassigned'
    `;

    db.query(getAppointmentsSQL, [subadminPincodes.join(",")], (err, appointmentData) => {
      if (err) {
        console.log("Error fetching appointments: ", err);
        return res.status(500).json({ error: "Failed to fetch unassigned appointments" });
      }

      if (appointmentData.length === 0) {
        return res.json({ message: "No unassigned appointments found" });
      }

      res.json(appointmentData);
    });
  });
};

const GET_APPOINTMENTS_WITH_REPLIES = (req, res) => {
  const sql = `
    SELECT 
      a.*, 
      ar.*
    FROM 
      appointment a
    INNER JOIN 
      appointment_replies ar ON a.appointment_no = ar.appointment_nos
    ORDER BY 
      a.time DESC
  `; // Fetch appointments with replies and order by time

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch data", error: err });
    }
    return res.json(data);
  });
};

const GET_APPOINTMENT_lOG_BY_ID = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT lm.*, a.appointment_no, a.name 
    FROM log_master lm
    JOIN appointment a ON lm.appointment_id = a.appointment_id
    WHERE lm.appointment_id = ?`;

  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch appointment details" });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(data);
  });
};




module.exports = {
  Get_ALL_APPOINTMENT,
  Get_ALL_APPOINTMENTS,
  GET_TODAY_APPOINTMENT_DASHBOARD,
  GET_APPOINTMENT_BY_STATUS,
  GET_LATEST_APPOINTMENT,
  GET_APPOINTMENT_COUNT,
  GET_ASSIGN_COUNT,
  GET_UNASSIGN_COUNT,
  GET_COMPLETED_COUNT,
  UPDATE_APPOINTMENT,
  GET_APPOINTMENT_BY_ID,
  ADD_APPOINTMENT,
  PREVIEW_APPOINTMENT,
  DOWNLOAD_APPOINTMENT,
  GET_SUBMITTED_APPOINTMENT_COUNT,
  GET_APPOINTMENT_BY_PINCODE,
  GET_CENTRE_BY_PINCODE,
  GET_ASSISTANT_BY_PINCODE,
  APPOINTMENT_FOR_ADMIN_TECHNICIAN,
  GET_REJECTED_COUNT,
  GET_REJECTED_APPOINTMENT,
  GET_NULL_APPOINTMENT_COUNT,
  GET_APPOINTMENTS_WITH_NULL_FIELDS,
  GET_TODAY_APPOINTMENT_COUNT,
  GET_COMPLETED_APPOINTMENT,
  APPOINTMENT_FOR_ADMIN_TO_SUBADMIN,
  GET_APPOINTMENTS_WITH_REPLIES,
  GET_APPOINTMENT_lOG_BY_ID
};

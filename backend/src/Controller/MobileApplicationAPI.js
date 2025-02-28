const db = require("../../db");

const CHECK_LOGIN_ASSISTANT = (req, res) => {
  const sql = "SELECT * FROM assistant WHERE `mobileno` = ? AND `password` = ? AND is_deleted='0'";
  db.query(sql, [req.body.mobileno, req.body.password], (err, data) => {
    if (err) {
      console.error("Login Error:", err);
      return res
        .status(500)
        .json({ status: "0", message: "Failed to fetch user data" });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: "1",
        message: "Login successful",
        user: data[0], // Send all user details from the first record
      });
    } else {
      return res.status(401).json({
        status: "0",
        message: "Invalid credentials",
      });
    }
  });
};

const UPDATE_FCM_TOKEN = (req, res) => {
  const { mobileno, fcmtokenkey } = req.body;

  if (!mobileno || !fcmtokenkey) {
    return res.status(400).json({
      status: "0",
      message: "mobileno and fcmtokenkey are required",
    });
  }

  const sql = "UPDATE assistant SET fcmtoken_key = ? WHERE mobileno = ?";
  db.query(sql, [fcmtokenkey, mobileno], (err, result) => {
    if (err) {
      console.error("FCM Token Update Error:", err);
      return res.status(500).json({
        status: "0",
        message: "Failed to update FCM token",
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: "1",
        message: "FCM token updated successfully",
      });
    } else {
      return res.status(404).json({
        status: "0",
        message: "Assistant not found",
      });
    }
  });
};

const GET_TODAY_APPOINTMENT = (req, res) => {
  const technicianId = req.query.technician_id;

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Get today's date in DD/MM/YYYY format manually
    const todayDate = new Date();
    const dd = String(todayDate.getDate()).padStart(2, "0"); // Ensure 2-digit format
    const mm = String(todayDate.getMonth() + 1).padStart(2, "0"); // Month is 0-based, add 1
    const yyyy = todayDate.getFullYear();
    const today = `${dd}/${mm}/${yyyy}`;

    // Second query to fetch appointment details for the matched appointment_ids
    const sql2 =
      "SELECT * FROM appointment WHERE time LIKE ? AND appointment_id IN (?) AND status = 'Unassigned'";
    db.query(sql2, [`${today}%`, appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
};

const GET_SCHEDULE_APPOINTMENT = (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Second query to fetch appointment details for the matched appointment_ids

    const sql2 =
      "SELECT * FROM appointment WHERE status = 'Assigned' AND appointment_id IN (?)";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
};

const GET_PENDING_APPOINTMENT = (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Second query to fetch appointment details for the matched appointment_ids

    const sql2 =
      "SELECT * FROM appointment WHERE status = 'Unassigned' AND rejected_status = '1' AND appointment_id IN (?)";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
};

const GET_ASSIGN_APPOINTMENT = (req, res) => {
  const sql = "SELECT * FROM appointment where status = 'Assigned'";
  db.query(sql, (err, data) => {
    if (err) {
      res.json("Fail to fetch");
    }
    return res.send(data);
    f;
  });
};

const UPDATE_APPOINTEMNT_STATUS = (req, res) => {
  const { id } = req.params;

  const sql = `
      UPDATE appointment
      SET status = 'Completed'
      WHERE appointment_id = ?
    `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error updating appointment status:", err);
      return res
        .status(500)
        .json({ message: "Failed to update appointment status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Emit notification to all connected clients
    io.emit("appointmentUpdated", { id, status: "Completed" });

    return res
      .status(200)
      .json({ message: "Appointment status updated to completed" });
  });
};

// const UPDATE_APPOINTEMNT_STATUS = (req, res) => {
//   const { id } = req.params;

//   const sql = `
//       UPDATE appointment
//       SET status = 'Completed'
//       WHERE appointment_id = ?
//     `;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error updating appointment status:", err);
//       return res
//         .status(500)
//         .json({ message: "Failed to update appointment status" });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }
//     return res
//       .status(200)
//       .json({ message: "Appointment status updated to completed" });
//   });
// };

const SEND_OTP = (req, res) => {
  const { mobileno } = req.body;

  // Input Validation
  if (!mobileno) {
    console.log("Mobile number is missing in the request body!");
    return res.status(400).json({
      success: false,
      message: "Mobile number is required!",
    });
  }

  // Check if the mobile number exists in the "assistant" table
  console.log("Checking if mobileno exists in the database:", mobileno);
  db.query(
    "SELECT * FROM assistant WHERE mobileno = ?",
    [mobileno],
    (err, assistant) => {
      if (err) {
        console.error("Error querying the database:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error while checking mobile number",
          error: err.message,
        });
      }

      // Log the result of the query to help with debugging
      console.log("Assistant query result:", assistant);

      if (assistant.length === 0) {
        // Mobile number not found in the database
        console.log(
          "Mobile number not found in the assistant table:",
          mobileno
        );
        return res.status(404).json({
          success: false,
          message: "Mobile number not found in assistant table!",
        });
      } else {
        console.log("Mobile number found in the assistant table:", mobileno);

        // If the mobile number exists, generate OTP and expiration time
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const expirationTime = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

        // Send OTP via WhatsApp or SMS using your API
        const xmlData = `user=SITSol&key=b6b34d1d4dXX&mobile=${mobileno}&message=Your OTP is ${otp}&senderid=DALERT&accusage=10`;
        const URL = "http://redirect.ds3.in/submitsms.jsp"; // Replace with your WhatsApp API endpoint

        // Using .then() and .catch() instead of async/await
        axios
          .post(URL, xmlData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((response) => {
            console.log("OTP sent successfully:", response.data);

            // Respond with success without including the API response
            return res.status(201).json({
              success: true,
              message: "OTP sent successfully",
              data: {
                mobileno,
                otp,
                expirationTime,
              },
            });
          })
          .catch((error) => {
            console.error("Error sending OTP:", error.message);

            // Respond with error
            return res.status(500).json({
              success: false,
              message: "Failed to send OTP",
              error: error.message,
            });
          });
      }
    }
  );
};

const FORGET_PASSWORD = async (req, res) => {
  const { mobileno, newPassword } = req.body;

  // Input Validation
  if (!mobileno || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Mobile number and new password are required!",
    });
  }

  try {
    // Check if the mobile number exists in the "assistant" table
    const assistant = await db.query(
      "SELECT * FROM assistant WHERE mobileno = ?",
      [mobileno]
    );

    if (assistant.length === 0) {
      // Mobile number not found in the database
      return res.status(404).json({
        success: false,
        message: "Mobile number not found!",
      });
    }

    // Update the password in the "assistant" table
    await db.query("UPDATE assistant SET password = ? WHERE mobileno = ?", [
      newPassword,
      mobileno,
    ]);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);

    // Respond with error
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

const ASSIGN_APPOINTMENT_FOR_TECHNICIAN = (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    // Extract appointment_ids from the first query result
    const appointmentIds = assignData.map((row) => row.appointment_id);

    // Second query to fetch appointment details for the matched appointment_ids
    const sql2 =
      // "SELECT * FROM appointment WHERE appointment_id IN (?) and status !='Completed'";
      "SELECT * FROM appointment WHERE appointment_id IN (?) and status !='Unassigned'";

    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch appointment details", error: err });
      }

      return res.json(appointmentData);
    });
  });
};

const COMPLETED_APPOINTMENT_FOR_TECHNICIAN = (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    // Extract appointment_ids from the first query result
    const appointmentIds = assignData.map((row) => row.appointment_id);

    // Second query to fetch appointment details for the matched appointment_ids
    const sql2 =
      "SELECT * FROM appointment WHERE appointment_id IN (?) and status ='Completed'";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch appointment details", error: err });
      }

      return res.json(appointmentData);
    });
  });
};

const REJECTED_APPOINTMENT = (req, res) => {
  console.log("Request body:", req.body);

  const { appointment_id, technician_id, reason } = req.body;

  const insertSql = `
    INSERT INTO rejected_appointment_by_technician 
    (appointment_id, technician_id, reason) 
    VALUES (?, ?, ?)
  `;

  const updateSql = `
    UPDATE appointment 
    SET status = 'Unassigned', rejected_status = '1' 
    WHERE appointment_id = ?
  `;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json("Transaction initiation failed");
    }

    // Insert into rejected_appointment_by_technician
    db.query(
      insertSql,
      [appointment_id, technician_id, reason],
      (err, result) => {
        if (err) {
          console.error("SQL Insert Error:", err);
          return db.rollback(() =>
            res.status(500).json("Failed to add appointment rejection")
          );
        }

        console.log("Insert Result:", result);

        // Update appointment table
        db.query(updateSql, [appointment_id], (err, updateResult) => {
          if (err) {
            console.error("SQL Update Error:", err);
            return db.rollback(() =>
              res.status(500).json("Failed to update appointment status")
            );
          }

          console.log("Update Result:", updateResult);

          db.commit((err) => {
            if (err) {
              console.error("Transaction Commit Error:", err);
              return db.rollback(() =>
                res.status(500).json("Transaction commit failed")
              );
            }

            return res
              .status(200)
              .json("Appointment rejected and status updated successfully");
          });
        });
      }
    );
  });
};

const GET_REJECTED_APPOINTMENT = (req, res) => {
  const technicianId = req.query.technician_id; // Get technician_id from query parameters

  if (!technicianId) {
    return res.status(400).json({ message: "technician_id is required" });
  }

  // First query to get the appointment_id(s) assigned to the technician
  const sql1 = "SELECT * FROM assign_appointment WHERE technician_id = ?";
  db.query(sql1, [technicianId], (err, assignData) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch assigned appointments", error: err });
    }

    if (assignData.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for the given technician" });
    }

    const appointmentIds = assignData.map((row) => row.appointment_id);
    console.log("----------" + appointmentIds.length);

    // Second query to fetch appointment details for the matched appointment_ids

    const sql2 =
      "SELECT * FROM appointment WHERE status = 'Assigned' AND appointment_id IN (?)";
    db.query(sql2, [appointmentIds], (err, appointmentData) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch appointment details",
          error: err,
        });
      }

      return res.json(appointmentData);
    });
  });
};

const DELETE_ASSISTANT = (req, res) => {
  const { id } = req.params;

  // SQL query to update is_deleted flag instead of deleting the row
  const sql = "UPDATE assistant SET is_deleted = 1 WHERE assistant_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error soft deleting Assistant:", err);
      return res.status(500).json({ message: "Failed to soft delete Assistant" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assistant not found" });
    }
    return res.status(200).json({ message: "Assistant soft deleted successfully" });
  });
};

const GET_ALL_TEST_REMARK_APP = (req, res) => {
  const sql = "SELECT remark FROM test_remark";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching laboratories:", err);
      return res.status(500).json("Failed to fetch laboratories");
    }
    return res.status(200).json(data);
  });
};


module.exports = {
  CHECK_LOGIN_ASSISTANT,
  UPDATE_FCM_TOKEN,
  GET_TODAY_APPOINTMENT,
  GET_SCHEDULE_APPOINTMENT,
  GET_PENDING_APPOINTMENT,
  GET_ASSIGN_APPOINTMENT,
  UPDATE_APPOINTEMNT_STATUS,
  SEND_OTP,
  FORGET_PASSWORD,
  ASSIGN_APPOINTMENT_FOR_TECHNICIAN,
  COMPLETED_APPOINTMENT_FOR_TECHNICIAN,
  REJECTED_APPOINTMENT,
  GET_REJECTED_APPOINTMENT,
  DELETE_ASSISTANT,
  GET_ALL_TEST_REMARK_APP,
};

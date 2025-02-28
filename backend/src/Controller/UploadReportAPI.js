const db = require("../../db");


const GET_APPOINTMENT_TO_UPLOAD_REPORT = (req, res) => {
    const { token_key } = req.query;
  
    console.log(`API called with token_key: ${token_key}`);
  
    if (!token_key) {
      console.log("Missing token_key in request");
      return res.status(400).json({ message: "Token key is required" });
    }
  
    // Step 1: Get all assistant IDs related to the token_key
    const getAssistantIdQuery = `SELECT assistant_id FROM assistant WHERE token_key = ?`;
  
    db.query(getAssistantIdQuery, [token_key], (err, assistantData) => {
      if (err) {
        console.error("Error fetching assistant_id:", err);
        return res.status(500).json({ message: "Failed to fetch assistant_id", error: err });
      }
  
      console.log("Assistant Data:", assistantData);
  
      if (assistantData.length === 0) {
        console.log("No assistant found for the given token");
        return res.status(404).json({ message: "No assistant found for the given token" });
      }
  
      // Extract all assistant IDs
      const assistantIds = assistantData.map(row => row.assistant_id);
      console.log(`Fetched assistant_ids: ${assistantIds}`);
  
      // Step 2: Get all appointment IDs linked to any of these assistants (technicians)
      const getAppointmentIdsQuery = `
        SELECT DISTINCT appointment_id FROM assign_appointment 
        WHERE technician_id IN (?)`;
  
      db.query(getAppointmentIdsQuery, [assistantIds], (err, appointmentData) => {
        if (err) {
          console.error("Error fetching appointment IDs:", err);
          return res.status(500).json({ message: "Failed to fetch appointment IDs", error: err });
        }
  
        console.log("Appointment Data from assign_appointment:", appointmentData);
  
        if (appointmentData.length === 0) {
          console.log("No appointments assigned to these technicians");
          return res.status(404).json({ message: "No appointments assigned to these technicians" });
        }
  
        const appointmentIds = appointmentData.map(row => row.appointment_id);
        console.log(`Fetched appointment IDs: ${appointmentIds}`);
  
        // Step 3: Fetch **all** appointments that match `appointment_id` AND have `status = 'completed'`
        const getAppointmentsQuery = `
          SELECT * FROM appointment WHERE appointment_id IN (?) AND status = 'Completed'`;
  
        db.query(getAppointmentsQuery, [appointmentIds], (err, appointments) => {
          if (err) {
            console.error("Error fetching appointment details:", err);
            return res.status(500).json({ message: "Failed to fetch appointment details", error: err });
          }
  
          console.log("Completed Appointments Data:", appointments);
  
          if (appointments.length === 0) {
            console.log("No completed appointments found for these technicians");
            return res.status(404).json({ message: "No completed appointments found for these technicians" });
          }
  
          console.log("Returning all completed appointments:", appointments);
          return res.json(appointments);
        });
      });
    });
  };
  
const GET_AFFOINTMENT_AFTER_UPLOAD_REPORT = (req, res) => {
    const { token_key } = req.query;
  
    console.log(`API called with token_key: ${token_key}`);
  
    if (!token_key) {
      console.log("Missing token_key in request");
      return res.status(400).json({ message: "Token key is required" });
    }
  
    // Step 1: Get all assistant IDs related to the token_key
    const getAssistantIdQuery = `SELECT assistant_id FROM assistant WHERE token_key = ?`;
  
    db.query(getAssistantIdQuery, [token_key], (err, assistantData) => {
      if (err) {
        console.error("Error fetching assistant_id:", err);
        return res.status(500).json({ message: "Failed to fetch assistant_id", error: err });
      }
  
      console.log("Assistant Data:", assistantData);
  
      if (assistantData.length === 0) {
        console.log("No assistant found for the given token");
        return res.status(404).json({ message: "No assistant found for the given token" });
      }
  
      // Extract all assistant IDs
      const assistantIds = assistantData.map(row => row.assistant_id);
      console.log(`Fetched assistant_ids: ${assistantIds}`);
  
      // Step 2: Get all appointment IDs linked to any of these assistants (technicians)
      const getAppointmentIdsQuery = `
        SELECT DISTINCT appointment_id FROM assign_appointment 
        WHERE technician_id IN (?)`;
  
      db.query(getAppointmentIdsQuery, [assistantIds], (err, appointmentData) => {
        if (err) {
          console.error("Error fetching appointment IDs:", err);
          return res.status(500).json({ message: "Failed to fetch appointment IDs", error: err });
        }
  
        console.log("Appointment Data from assign_appointment:", appointmentData);
  
        if (appointmentData.length === 0) {
          console.log("No appointments assigned to these technicians");
          return res.status(404).json({ message: "No appointments assigned to these technicians" });
        }
  
        const appointmentIds = appointmentData.map(row => row.appointment_id);
        console.log(`Fetched appointment IDs: ${appointmentIds}`);
  
        // Step 3: Fetch **all** appointments that match `appointment_id` AND have `status = 'completed'`
        const getAppointmentsQuery = `
          SELECT * FROM appointment WHERE appointment_id IN (?) AND status = 'Submitted'`;
  
        db.query(getAppointmentsQuery, [appointmentIds], (err, appointments) => {
          if (err) {
            console.error("Error fetching appointment details:", err);
            return res.status(500).json({ message: "Failed to fetch appointment details", error: err });
          }
  
          console.log("Completed Appointments Data:", appointments);
  
          if (appointments.length === 0) {
            console.log("No completed appointments found for these technicians");
            return res.status(404).json({ message: "No completed appointments found for these technicians" });
          }
  
          console.log("Returning all completed appointments:", appointments);
          return res.json(appointments);
        });
      });
    });
  };

  const GET_APPOINTMENT_FOR_ADMIN_REPORT = (req, res) => {
    const sql = `
    SELECT * FROM appointment 
    WHERE status = 'Submitted' 
    ORDER BY created_at DESC;
    `;
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching appointments:", err);
        return res.status(500).json("Failed to fetch appointments");
      }
      return res.status(200).json(data);
    });
  };
const GET_APPOINTMENT_REPORT_FOR_SUBADMIN = (req, res) => {
    const subadmin_id = req.query.subadmin_id; // Get subadmin_id from request query
  
    if (!subadmin_id) {
      return res.status(401).json({ error: "Unauthorized: No assistant ID provided" });
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


module.exports = {
    GET_APPOINTMENT_TO_UPLOAD_REPORT,
    GET_AFFOINTMENT_AFTER_UPLOAD_REPORT,
    GET_APPOINTMENT_FOR_ADMIN_REPORT,
    GET_APPOINTMENT_REPORT_FOR_SUBADMIN
};

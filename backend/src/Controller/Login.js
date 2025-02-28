const db = require("../../db");

const AdminLogin= (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin_login WHERE `email` = ? AND `password` = ?";

  db.query(sql, [email, password], (err, data) => {
    if (err) {
      console.error("Login Error:", err);
      return res
        .status(500)
        .json({ status: "0", message: "Failed to fetch user data" });
    }

    if (data.length > 0) {
      const { post, token_key, email, id } = data[0];

      // Check if the user exists in subadminmaster table
      const subadminQuery = "SELECT subadmin_id FROM subadminmaster WHERE email = ?";
      db.query(subadminQuery, [email], (err, subadminData) => {
        if (err) {
          console.error("Error checking subadmin:", err);
          return res.status(500).json({ status: "0", message: "Database error" });
        }

        if (subadminData.length > 0) {
          return res.status(200).json({
            status: "1",
            message: "Login successful",
            post,
            token_key,
            email,
            id,
            subadmin_id: subadminData[0].subadmin_id, // Send subadmin_id if found
          });
        } else {
          // If not found in subadmin, check laboratory table
          const labQuery = "SELECT lab_id FROM laboratory WHERE email = ?";
          db.query(labQuery, [email], (err, labData) => {
            if (err) {
              console.error("Error checking laboratory:", err);
              return res.status(500).json({ status: "0", message: "Database error" });
            }

            // Debugging logs
            console.log("Lab Data:", labData);

            if (!labData || labData.length === 0) {
              console.log("No lab_id found for this email.");
            } else {
              console.log("Fetched lab_id:", labData[0].lab_id);
            }

            return res.status(200).json({
              status: "1",
              message: "Login successful",
              post,
              token_key,
              email,
              id,
              lab_id: labData.length > 0 ? labData[0].lab_id : "Not Found", // Debugging output
            });
          });
        }
      });
    } else {
      return res.status(401).json({
        status: "0",
        message: "Invalid credentials",
      });
    }
  });
};

module.exports = {
  AdminLogin,
};

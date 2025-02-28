const db = require("../../db");

const GET_USER_DETAILS = (req, res) => {
  const tokenKey = req.query.tokenKey;

  if (!tokenKey) {
    return res.status(400).json({
      status: "0",
      message: "Token key is required",
    });
  }

  const sql = `
      SELECT 
        a.*, 
        am.* 
      FROM admin_login a
      LEFT JOIN address_master am ON a.token_key = am.token_key
      WHERE a.token_key = ?`;

  db.query(sql, [tokenKey], (err, data) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({
        status: "0",
        message: "Failed to fetch user details",
      });
    }

    if (data.length > 0) {
      const userDetails = {
        adminDetails: {
          id: data[0].id,
          name: data[0].name,
          post: data[0].post,
          username: data[0].username,
          email: data[0].email,
          token_key: data[0].token_key,
          // Add other fields from admin_login as needed
        },
        addressDetails: {
          address_id: data[0].address_id,
          user_id: data[0].user_id,
          address: data[0].address,
          city: data[0].city,
          state: data[0].state,
          country: data[0].country,
          pincode: data[0].pincode,
          // Add other fields from address_master as needed
        },
      };

      return res.status(200).json({
        status: "1",
        userDetails,
      });
    } else {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }
  });
};

const GET_ADDRESS_DETAILS = (req, res) => {
  const tokenKey = req.query.tokenKey;

  if (!tokenKey) {
    return res.status(400).json({
      status: "0",
      message: "Token key is required",
    });
  }

  const sql = "SELECT * FROM address_master WHERE `token_key` = ?";
  db.query(sql, [tokenKey], (err, data) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({
        status: "0",
        message: "Failed to fetch user details",
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: "1",
        userDetails: data[0],
      });
    } else {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }
  });
};

const GET_PROFILE_BY_ID = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM address_master WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching address:", err);
      return res.status(500).json("Failed to fetch address");
    }
    if (data.length === 0) {
      return res.status(404).json("Address not found");
    }
    return res.status(200).json(data[0]);
  });
};

const SAVE_PROFILE = (req, res) => {
  const { tokenKey, address, country, state, city, pincode, mobileno } =
    req.body;

  if (!tokenKey) {
    return res.status(400).json({
      status: "0",
      message: "Token key is required",
    });
  }

  // Check if an address exists for the given tokenKey
  const checkSql = "SELECT * FROM address_master WHERE `token_key` = ?";
  db.query(checkSql, [tokenKey], (err, data) => {
    if (err) {
      console.error("Error checking address info:", err);
      return res.status(500).json({
        status: "0",
        message: "Error checking address info",
      });
    }

    if (data.length > 0) {
      // If address exists, update only the provided fields
      const currentData = data[0]; // Existing data for the tokenKey
      const updatedAddress = address || currentData.address;
      const updatedCountry = country || currentData.country;
      const updatedState = state || currentData.state;
      const updatedCity = city || currentData.city;
      const updatedPincode = pincode || currentData.pincode;
      const updatedMobileno = mobileno || currentData.mobileno;

      const updateSql = `
          UPDATE address_master 
          SET address = ?, country = ?, state = ?, city = ?, pincode = ?, mobileno = ?
          WHERE token_key = ?
        `;
      db.query(
        updateSql,
        [
          updatedAddress,
          updatedCountry,
          updatedState,
          updatedCity,
          updatedPincode,
          updatedMobileno,
          tokenKey,
        ],
        (err, result) => {
          if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({
              status: "0",
              message: "Failed to update address",
            });
          }
          return res.status(200).json({
            status: "1",
            message: "Address updated successfully",
          });
        }
      );
    } else {
      // If address doesn't exist, insert a new record
      const insertSql = `
          INSERT INTO address_master (token_key, address, country, state, city, pincode, mobileno)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      db.query(
        insertSql,
        [tokenKey, address, country, state, city, pincode, mobileno],
        (err, result) => {
          if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({
              status: "0",
              message: "Failed to add address",
            });
          }
          return res.status(200).json({
            status: "1",
            message: "Address added successfully",
          });
        }
      );
    }
  });
};

module.exports = {
  GET_USER_DETAILS,
  GET_ADDRESS_DETAILS,
  GET_PROFILE_BY_ID,
  SAVE_PROFILE,
};

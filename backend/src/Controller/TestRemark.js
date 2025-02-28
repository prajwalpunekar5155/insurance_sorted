const db = require("../../db");

const GET_ALL_TEST_REMARK = (req, res) => {
  const sql = "SELECT * FROM test_remark";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching laboratories:", err);
      return res.status(500).json("Failed to fetch laboratories");
    }
    return res.status(200).json(data);
  });
};

const ADD_REMARK = (req, res) => {
  const { remark } = req.body;

  if (!remark) {
    return res.status(400).json("All fields are required!");
  }

  const sql = `
        INSERT INTO test_remark (remark)
        VALUES (?)
      `;

  db.query(
    sql,
    [remark], // Include token_key in the query
    (err, result) => {
      if (err) {
        console.error("Error adding assistant:", err);
        return res.status(500).json("Failed to add assistant");
      }
      return res.status(201).json("Remark added successfully");
    }
  );
};

// Update Assistant by ID
const UPDATE_REMARK = (req, res) => {
  const { id } = req.params;
  const { remark } = req.body;

  // Check if remark exists
  if (!remark) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Ensure ID is a valid number
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid remark ID" });
  }

  console.log(`Updating remark ID: ${id} with remark: ${remark}`);

  const sql = `
          UPDATE test_remark
          SET remark = ?
          WHERE remark_id = ?
        `;

  db.query(sql, [remark, id], (err, result) => {
    if (err) {
      console.error("Error updating assistant:", err);
      return res.status(500).json({ error: "Failed to update assistant" });
    }

    // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Remark not found" });
    }

    return res.status(200).json({ message: "Remark updated successfully" });
  });
};

const DELETE_REMARK = (req, res) => {
  const { id } = req.params;

  // SQL query to update is_deleted flag instead of deleting the row
  const sql = "UPDATE test_remark SET is_deleted = 1 WHERE remark_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error soft deleting Assistant:", err);
      return res
        .status(500)
        .json({ message: "Failed to soft delete Assistant" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assistant not found" });
    }
    return res
      .status(200)
      .json({ message: "Assistant soft deleted successfully" });
  });
};

const GET_REMARK_BY_ID = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM test_remark WHERE remark_id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error("Error fetching assistant:", err);
      return res.status(500).json("Failed to fetch assistant");
    }
    if (data.length === 0) {
      return res.status(404).json("Assistant not found");
    }
    return res.status(200).json(data[0]);
  });
};

module.exports = {
  GET_ALL_TEST_REMARK,
  ADD_REMARK,
  UPDATE_REMARK,
  DELETE_REMARK,
  GET_REMARK_BY_ID,
};

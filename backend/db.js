const { app } = require("firebase-admin");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "insuerence"
});

// const db = mysql.createConnection({
//   host: "103.165.119.60",
//   user: "sitsolutionsco_insurance_db",
//   password: "insurance_db@2024#",
//   database: "sitsolutionsco_insurance_db"
// });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database"); 
});

module.exports = db;

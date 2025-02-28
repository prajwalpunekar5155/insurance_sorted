const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const multer = require("multer");
const path = require("path");
const { default: axios } = require("axios");
const fs = require("fs");

const app = express();
app.use(
  cors({
    // origin: ["http://103.165.119.60:3000"],
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "insuerence",
});

//  const db = mysql.createConnection({
//    host: "103.165.119.60",
//    user: "sitsolutionsco_insurance_db",
//    password: "insurance_db@2024#",
//    database: "sitsolutionsco_insurance_db"
//  });


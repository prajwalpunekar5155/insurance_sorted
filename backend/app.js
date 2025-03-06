const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const Profile = require("./routes");
require("./src/Controller/EmailFetchingAPI");
const multer = require("multer");
const path = require("path");
const db = require("./db");

// Initialize Express App
const app = express();
const port = 8085;

// Setup HTTP Server with Socket.IO
// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//   },
// });

// // Store io globally
// global.io = io;

// io.on("connection", (socket) => {
//   console.log("A user connected");
// });

// Middlewares
app.use(
  cors({
    // origin: ["http://103.165.118.71:3010"],
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
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
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use("/", Profile);

app.get("/", (req, res) => {
  return res.json("From Backend");
});

// Start Server
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

// Configure Multer for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads/reports"); // Folder to store PDFs
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
  },
});

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// API to upload PDF and update status
app.post("/uploadReport", uploadPDF.single("report_pdf"), (req, res) => {
  const { appointment_id, updated_by } = req.body;
  const pdfPath = req.file ? `uploads/reports/${req.file.filename}` : null;

  if (!appointment_id || !pdfPath || !updated_by) {
    return res.status(400).json({
      error: "appointment_id, report_pdf, and updated_by (lab_id) are required",
    });
  }

  // Fetch title from the laboratory table
  const labSql = "SELECT title FROM laboratory WHERE lab_id = ?";
  db.query(labSql, [updated_by], (labErr, labResult) => {
    if (labErr) {
      console.error("Error fetching lab title:", labErr);
      return res.status(500).json({ error: "Failed to retrieve lab title" });
    }

    if (labResult.length === 0) {
      return res.status(404).json({ error: "Laboratory not found" });
    }

    const labTitle = labResult[0].title;
    const updatedByValue = `${labTitle}`; // Store title with lab_id

    // Update appointment table
    const updateSql =
      "UPDATE appointment SET report_pdf = ?, status = 'Submitted' WHERE appointment_id = ?";

    db.query(updateSql, [pdfPath, appointment_id], (err, result) => {
      if (err) {
        console.error("Error updating appointment:", err);
        return res.status(500).json({ error: "Failed to upload report" });
      }

      // Insert log into log_master
      const logSql =
        "INSERT INTO log_master (appointment_id, status, updated_by, updated_at) VALUES (?, 'Report Uploaded', ?, NOW())";

      db.query(
        logSql,
        [appointment_id, updatedByValue],
        (logErr, logResult) => {
          if (logErr) {
            console.error("Error inserting log:", logErr);
            return res.status(500).json({ error: "Failed to log action" });
          }

          res.status(200).json({
            message:
              "Report uploaded successfully, status updated to 'Submitted', and logged in log_master",
          });
        }
      );
    });
  });
});

// Serve uploaded PDF reports
app.use(
  "/uploads/reports",
  express.static(path.join(__dirname, "uploads/reports"))
);

//Application API

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads/images"); // Store all files in 'uploads/images'
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer Upload Config: Handling Multiple Files
const upload = multer({
  storage,
}).fields([
  { name: "images", maxCount: 5 }, // Allow up to 5 images
  { name: "video", maxCount: 1 }, // Single video file
]);

// Add Appointment API
// app.post("/addappointmentapp", upload, (req, res) => {
//   console.log("Received Request:", req.body);
//   console.log("Received Files:", req.files);

//   const {
//     appointment_nos,
//     latitude,
//     longitude,
//     description,
//     assistant_id,
//     urine_test,
//     ecg_test,
//     blood_test,
//     test_completed,
//     reason,
//   } = req.body;

//   // Get uploaded file paths
//   const imagePaths =
//     req.files && req.files["images"]
//       ? req.files["images"].map((file) => `uploads/images/${file.filename}`)
//       : [];

//   const videoPath =
//     req.files && req.files["video"] && req.files["video"][0]
//       ? `uploads/images/${req.files["video"][0].filename}`
//       : null;

//   console.log("Image Paths:", imagePaths);
//   console.log("Video Path:", videoPath);

//   // Check if videoPath is undefined
//   if (!videoPath) {
//     console.error("Error: No video file received");
//   }

//   // Convert imagePaths array to a JSON string to store in the database
//   const sql =
//     "INSERT INTO appointment_replies (appointment_nos, description, images, video, latitude, longitude, assistant_id, urine_test, ecg_test, blood_test, test_completed, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

//   db.query(
//     sql,
//     [
//       appointment_nos,
//       description,
//       JSON.stringify(imagePaths), // Store multiple images as JSON array
//       videoPath,
//       latitude,
//       longitude,
//       assistant_id,
//       urine_test,
//       ecg_test,
//       blood_test,
//       test_completed,
//       reason,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({ error: "Failed to add appointment" });
//       }
//       res.status(200).json({ message: "Appointment added successfully" });
//     }
//   );
// });

app.post("/addappointmentapp", upload, (req, res) => {
  console.log("Received Request:", req.body);
  console.log("Received Files:", req.files);

  const {
    appointment_nos,
    latitude,
    longitude,
    description,
    assistant_id,
    urine_test,
    ecg_test,
    blood_test,
    test_completed,
    reason,
  } = req.body;

  const imagePaths =
    req.files && req.files["images"]
      ? req.files["images"].map((file) => `uploads/images/${file.filename}`)
      : [];

  const videoPath =
    req.files && req.files["video"] && req.files["video"][0]
      ? `uploads/images/${req.files["video"][0].filename}`
      : null;

  console.log("Image Paths:", imagePaths);
  console.log("Video Path:", videoPath);

  // if (!videoPath) {
  //   console.error("Error: No video file received");
  // }

  // Step 1: Fetch appointment_id from the appointment table
  const fetchAppointmentIdQuery =
    "SELECT appointment_id FROM appointment WHERE appointment_no = ?";

  db.query(
    fetchAppointmentIdQuery,
    [appointment_nos],
    (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error("Error fetching appointment_id:", fetchErr);
        return res
          .status(500)
          .json({ error: "Failed to fetch appointment_id" });
      }

      if (fetchResult.length === 0) {
        return res.status(404).json({ error: "Appointment number not found" });
      }

      const appointment_id = fetchResult[0].appointment_id;

      // Step 2: Insert into appointment_replies
      const insertAppointmentReplyQuery =
        "INSERT INTO appointment_replies (appointment_nos, description, images, video, latitude, longitude, assistant_id, urine_test, ecg_test, blood_test, test_completed, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      db.query(
        insertAppointmentReplyQuery,
        [
          appointment_nos,
          description,
          JSON.stringify(imagePaths),
          videoPath,
          latitude,
          longitude,
          assistant_id,
          urine_test,
          ecg_test,
          blood_test,
          test_completed,
          reason,
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Database Error:", insertErr);
            return res
              .status(500)
              .json({ error: "Failed to add appointment reply" });
          }

          // Step 3: Fetch technician name using assistant_id
          const fetchTechnicianQuery =
            "SELECT name FROM assistant WHERE assistant_id = ?";
          db.query(
            fetchTechnicianQuery,
            [assistant_id],
            (techErr, techResult) => {
              if (techErr) {
                console.error("Error fetching technician name:", techErr);
                return res
                  .status(500)
                  .json({ error: "Failed to fetch technician name" });
              }

              const technicianName =
                techResult.length > 0 ? techResult[0].name : "Unknown";

              // Step 4: Insert log entry into log_master
              const insertLogQuery =
                "INSERT INTO log_master (appointment_id, status, updated_by, updated_at) VALUES (?, ?, ?, NOW())";

              db.query(
                insertLogQuery,
                [appointment_id, "Completed", technicianName],
                (logErr) => {
                  if (logErr) {
                    console.error("Error inserting log:", logErr);
                    return res
                      .status(500)
                      .json({ error: "Failed to insert log" });
                  }

                  res.status(200).json({
                    message:
                      "Appointment reply added and log updated successfully",
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

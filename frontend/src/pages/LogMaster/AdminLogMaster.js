// Code by Prajwal Punekar

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AppointmentLogTable = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchAppointmentLogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/getAppointmentByLogmasterId/${id}`
        );
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch appointment logs:", error);
      }
    };

    fetchAppointmentLogs();
  }, [id]);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#4e73df",
          textAlign: "center",
        }}
      >
        Appointment Logs
      </h2>

      <TableContainer
        component={Paper}
        style={{ maxWidth: "900px", margin: "auto" }}
      >
        <ul
          className="breadcrumb"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip title="Go Back" arrow>
            <IconButton onClick={() => window.history.back()} color="primary">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </ul>
        <Table>
          <TableHead style={{ backgroundColor: "#2E37A4" }}>
            <TableRow>
              {/* <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Log ID
              </TableCell> */}
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Appointment No
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Client Name
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Updated By
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Updated At
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.log_id}>
                  {/* <TableCell>{log.log_id}</TableCell> */}
                  <TableCell>{log.appointment_no.trim()}</TableCell>
                  <TableCell>{log.name.trim()}</TableCell>
                  <TableCell>{log.status}</TableCell>
                  <TableCell>{log.updated_by}</TableCell>
                  <TableCell>
                    {new Date(log.updated_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentLogTable;

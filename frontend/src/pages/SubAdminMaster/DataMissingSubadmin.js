// Code by Prajwal Punekar

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navBar";
import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Appointment() {
  const [appointment, setAppointmentList] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false); // Track showing details
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const itemsPerPage = 50; // Number of items per page

  useEffect(() => {
    const getRejectedAppointments = async () => {
      const subadmin_id = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadmin_id) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8085/getadmintosubadminappointment?subadmin_id=${subadmin_id}`
        );
        const data = await res.json();

        if (res.status === 200 && Array.isArray(data)) {
          setAppointmentList(data);
          setFilteredAppointments(data);
        } else {
          setAppointmentList([]); // Ensure it's an empty array instead of undefined
          setFilteredAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching rejected appointments:", error);
        setAppointmentList([]); // Handle network errors
        setFilteredAppointments([]);
      }
    };

    getRejectedAppointments();
  }, []);



  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    const modal = document.getElementById("viewAppointmentModal");
    if (modal) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modal);
      modalInstance.show();
    }
  };

  const handleDownloadExcel = () => {
    window.open("http://localhost:8085/downloadAppointments", "_blank");
  };

  const handleImageClick = () => {
    setShowAppointmentDetails(true);
  };

  const handleCloseModal = () => {
    setShowAppointmentDetails(false);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    console.log("Search Query:", query);
    console.log("Appointment List Before Filtering:", appointment);

    if (!appointment || appointment.length === 0) {
      console.log("No appointments available.");
      return;
    }

    const filtered = appointment.filter((appt) => {
      const name = appt.name?.toLowerCase() || "";
      const mobileno = appt.mobileno?.toString().toLowerCase() || "";
      const appointmentNo = appt.appointment_no?.toString().toLowerCase() || "";
      const pincode = appt.pincode?.toString().toLowerCase() || "";

      const match =
        name.includes(query) ||
        mobileno.includes(query) ||
        appointmentNo.includes(query) ||
        pincode.includes(query);

      console.log(`Checking Appointment: ${JSON.stringify(appt)}`, match);

      return match;
    });

    console.log("Filtered Results:", filtered);
    setFilteredAppointments(filtered);
  };

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi"); // Global, case-insensitive match
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Pagination logic
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Handle page change
  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div>
      <div className="main-wrapper">
        <Navbar />

        <div className="page-wrapper">
          <div className="content">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <Tooltip title="Go Back" arrow>
                      <IconButton
                        onClick={() => window.history.back()}
                        color="primary"
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Appointment</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search here"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                  />
                                  <a className="btn">
                                    <img
                                      src="assets/img/icons/search-normal.svg"
                                      alt=""
                                    />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                {/* <Link
                                  to="/addAppointment"
                                  style={{ textDecoration: "none" }}
                                  className="btn btn-primary add-pluss ms-2"
                                >
                                  <img src="assets/img/icons/plus.svg" alt="" />
                                </Link> */}
                                <a
                                  // href="javascript:;"
                                  className="btn btn-primary doctor-refresh ms-2"
                                  onClick={() => window.location.reload()}
                                >
                                  <img
                                    src="assets/img/icons/re-fresh.svg"
                                    alt=""
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-auto text-end float-end ms-auto download-grp">
                          <a href="javascript:;" className=" me-2">
                            <img
                              src="assets/img/icons/pdf-icon-01.svg"
                              alt=""
                            />
                          </a>
                          <a href="javascript:;" className=" me-2">
                            <img
                              src="assets/img/icons/pdf-icon-02.svg"
                              alt=""
                            />
                          </a>
                          <a href="javascript:;" className=" me-2">
                            <img
                              src="assets/img/icons/pdf-icon-03.svg"
                              alt=""
                            />
                          </a>

                          <div>
                           
                            <a onClick={handleImageClick}>
                              <img
                                src="assets/img/icons/pdf-icon-04.svg"
                                alt="View Appointments"
                              />
                            </a>

                            
                            <Dialog
                              open={showAppointmentDetails}
                              onClose={handleCloseModal}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogTitle
                                sx={{
                                  backgroundColor: "#2E37A4",
                                  color: "white",
                                  fontWeight: "bold",
                                  padding: "16px",
                                }}
                              >
                                <Typography variant="h6">
                                  Appointments
                                </Typography>
                              </DialogTitle>
                              <DialogContent sx={{ padding: "16px" }}>
                               
                                <Table>
                                  <TableHead
                                    sx={{ backgroundColor: "#f4f6f9" }}
                                  >
                                    <TableRow>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Appointment Time
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Client Name
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Medical Test Details
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Contact No
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Proposal No
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Address
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Country
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        State
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        City
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Pincode
                                      </TableCell>

                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        Insurance Company Name
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#2E37A4",
                                        }}
                                      >
                                        TPA Details
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {appointment.map((appointment) => (
                                      <TableRow key={appointment.id}>
                                        <TableCell>
                                          {new Date(
                                            appointment.time
                                          ).toLocaleString("en-US", {
                                            timeZone: "Asia/Kolkata",
                                          })}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.name}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.treatment}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.mobileno}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.appointment_no}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.address}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.country}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.state}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.city}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.pincode}
                                        </TableCell>

                                        <TableCell>
                                          {appointment.insurance_name}
                                        </TableCell>
                                        <TableCell>
                                          {appointment.tpa_details}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DialogContent>
                              <DialogActions sx={{ padding: "16px" }}>
                                
                                <Button
                                  onClick={handleDownloadExcel}
                                  color="primary"
                                  variant="contained"
                                >
                                  Download Excel
                                </Button>
                              
                                <Button
                                  onClick={handleCloseModal}
                                  color="secondary"
                                  variant="outlined"
                                >
                                  Close
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "10px",
                      }}
                    >
                      <Link
                        to="/addAppointment"
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="contained" color="primary">
                          Add Appointment
                        </Button>
                      </Link>
                    </div> */}

                    <div className="table-responsive">
                      <table
                        className="table table-bordered custom-table comman-table datatable mb-0"
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          borderRadius: "8px", // Adding border radius to make it rounder
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adding subtle shadow for depth
                        }}
                      >
                        <thead
                          style={{
                            backgroundColor: "#f4f6f9",
                            borderBottom: "2px solid #ddd",
                            borderTopLeftRadius: "8px", // Round the top-left corner
                            borderTopRightRadius: "8px", // Round the top-right corner
                          }}
                        >
                          <tr style={{ textAlign: "left" }}>
                            <th
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Sr.No
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Appointment Date
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Client Name
                            </th>
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Medical Test Details
                            </th> */}
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Contact No
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Appointment No
                            </th>
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Address
                            </th> */}
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Country
                            </th> */}
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              State
                            </th> */}
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              City
                            </th> */}
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Pincode
                            </th>
                            <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Status
                            </th>

                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Insurance Company Name
                            </th> */}
                            {/* <th
                              style={{
                                fontWeight: "bold",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              TPA Details
                            </th> */}
                            <th
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "#2E37A4",
                                padding: "12px 15px",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAppointments.map((getcate, index) => (
                            <tr
                              key={getcate.appointment_id}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                                borderBottom: "1px solid #ddd", // Adds border between rows
                              }}
                            >
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "12px 15px",
                                }}
                              >
                                {indexOfFirstAppointment + index + 1}
                              </td>
                              {/* <td style={{ padding: "12px 15px" }}>
                                {new Date(getcate.time).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                    timeZone: "Asia/Kolkata",
                                  }
                                )}
                              </td> */}
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.time}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.name}
                              </td>
                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.treatment}
                              </td> */}
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.mobileno}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.appointment_no}
                              </td>
                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.address}
                              </td> */}
                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.country}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.state}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.city}
                              </td> */}
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.pincode}
                              </td>
                              <td style={{ padding: "12px 15px" }}>
                                {getcate.status}
                              </td>

                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.insurance_name}
                              </td> */}
                              {/* <td style={{ padding: "12px 15px" }}>
                                {getcate.tpa_details}
                              </td> */}
                              <td
                                className="text-center"
                                style={{
                                  padding: "12px 15px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div className="dropdown dropdown-action">
                                  <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{
                                      fontSize: "16px",
                                      color: "#333",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <a
                                      className="dropdown-item"
                                      onClick={() => handleViewDetails(getcate)}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <VisibilityIcon
                                        style={{ marginRight: "8px" }}
                                      />
                                      View
                                    </a>
                                    <Link
                                      to={`/edit-appointment/${getcate.appointment_id}`}
                                      className="dropdown-item"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      <EditIcon
                                        style={{ marginRight: "8px" }}
                                      />
                                      Edit
                                    </Link>

                                    {/* <a
                                      className="dropdown-item"
                                      href="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_patient"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <DeleteIcon
                                        style={{ marginRight: "8px" }}
                                      />
                                      Delete
                                    </a> */}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Component */}
                      <div
                        className="pagination-container"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "center",
                          marginTop: "20px",
                          padding: "10px",
                        }}
                      >
                        {/* Entry Range Display */}
                        <div
                          className="entry-range"
                          style={{ fontSize: "14px", color: "#555" }}
                        >
                          {filteredAppointments.length === 0
                            ? "No entries"
                            : `${indexOfFirstAppointment + 1} - ${Math.min(
                                indexOfLastAppointment,
                                filteredAppointments.length
                              )} of ${filteredAppointments.length} entries`}
                        </div>

                        {/* Pagination Component */}
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={paginate}
                          color="primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#f1f1f1",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            © {new Date().getFullYear()}{" "}
            <a
              href="https://sitsolutions.co.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              S IT Solutions Pvt. Ltd.
            </a>{" "}
            All Rights Reserved.
          </footer>
        </div>

        <div
          id="delete_patient"
          className="modal fade delete-modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img src="assets/img/sent.png" alt="" width="50" height="46" />
                <h3>Are you sure want to delete this ?</h3>
                <div className="m-t-20">
                  {" "}
                  <a href="#" className="btn btn-white" data-bs-dismiss="modal">
                    Close
                  </a>
                  <button type="submit" className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Viewing Appointment Details */}
        <div
          className="modal fade"
          id="viewAppointmentModal"
          tabIndex="-1"
          aria-labelledby="viewAppointmentModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{
              maxWidth: "700px",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                border: "none",
              }}
            >
              {/* Header */}
              <div
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  color: "#fff",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  padding: "15px 20px",
                }}
              >
                <h5
                  className="modal-title fw-bold"
                  style={{
                    fontSize: "1.5rem",
                  }}
                >
                  <i className="fa-solid fa-calendar-check me-2"></i>
                  Appointment Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              {/* Body */}
              <div
                className="modal-body"
                style={{
                  padding: "30px 25px",
                  fontSize: "1rem",
                  backgroundColor: "#fafbfc",
                }}
              >
                {selectedAppointment ? (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Appointment No:</strong>{" "}
                          {selectedAppointment.appointment_no}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Date:</strong> {selectedAppointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Name:</strong> {selectedAppointment.name}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Mobile:</strong>{" "}
                          {selectedAppointment.mobileno}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Visit Type:</strong>{" "}
                          {selectedAppointment.visit_type}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Test Details:</strong>{" "}
                          {selectedAppointment.treatment}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Address:</strong>{" "}
                          {selectedAppointment.address}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Country:</strong>{" "}
                          {selectedAppointment.country}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>State:</strong> {selectedAppointment.state}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>City:</strong> {selectedAppointment.city}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Pincode:</strong>{" "}
                          {selectedAppointment.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Insurance Name:</strong>{" "}
                          {selectedAppointment.insurance_name}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>TPA Details:</strong>{" "}
                          {selectedAppointment.tpa_details}
                        </p>
                      </div>
                    </div>

                    <div
                      className="modal-header"
                      style={{
                        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                        color: "#fff",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        padding: "15px 20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <h5
                        className="modal-title fw-bold"
                        style={{
                          fontSize: "1.5rem",
                        }}
                      >
                        <i className="fa-solid fa-calendar-check me-2"></i>
                        Appointment Reply from Technician
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Description:</strong>{" "}
                          {selectedAppointment.description}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Time:</strong>{" "}
                          {new Date(selectedAppointment.time).toLocaleString(
                            "en-IN",
                            { timeZone: "Asia/Kolkata" }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Latitude:</strong>{" "}
                          {selectedAppointment.latitude}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Longitude:</strong>{" "}
                          {selectedAppointment.longitude}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{
                          backgroundColor: "#e7f1ff",
                          borderLeft: "4px solid #4e73df",
                        }}
                      >
                        <p style={{ margin: 0, color: "#4e73df" }}>
                          <strong>Image:</strong>
                        </p>
                        <img
                          src={`http://localhost:8085/${selectedAppointment.image}`}
                          alt="Appointment"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginTop: "5px",
                            cursor: "pointer", // Makes it clear the image is clickable
                          }}
                          onClick={handleImageClick} // Opens the preview modal
                        />
                      </div>
                    </div>

                    {/* Image Preview Dialog */}
                    <Dialog
                      open={showAppointmentDetails}
                      onClose={handleCloseModal}
                      maxWidth="md"
                    >
                      <DialogTitle>Image Preview</DialogTitle>
                      <DialogContent>
                        <img
                          src={`http://localhost:8085/${selectedAppointment.image}`}
                          alt="Full Preview"
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#6c757d",
                      fontSize: "1.1rem",
                    }}
                  >
                    No details available.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #e9ecef",
                  padding: "15px 20px",
                }}
              >
                {/* <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleViewDetails(selectedAppointment)}
                >
                  Take Action
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointment;

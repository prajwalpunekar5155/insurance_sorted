// Code by Prajwal Punekar

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../navBar";

function Home() {
  const userRole = sessionStorage.getItem("post");
  const [appointments, setAppointments] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [laboratoryCount, setLaboratoryCount] = useState(0);
  const [assignedAppointmentCount, setAssignedAppointmentCount] = useState(0);
  const [completedAppointmentCount, setCompletedAppointmentCount] = useState(0);
  const [unassignedAppointmentCount, setUnAssignedAppointmentCount] =
    useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [todayappointmentCount, setTodayAppointmentCount] = useState(0);
  const [appointmentnullCount, setAppointmentNullCount] = useState(0);

  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const reportPages = [
      "/appointmentreport",
      "/diagnosticreport",
      "/assistantreport",
      "/uploadreport",
    ];

    // Open reports menu only when on a report page
    setIsReportsOpen(reportPages.includes(location.pathname));
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/gettodayappointmentdashboard",
          { withCredentials: true }
        );
        setAppointments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    const fetchAppointmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/countAppointmentsForSubadmin?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        setAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchLaboratoryCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/getLaboratoriesCount",
          { withCredentials: true }
        );
        setLaboratoryCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchAssignedAppintmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/assigncountAppointmentsForSubadmin?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        setAssignedAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchUnAssignedAppintmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/countUnassignedAppointmentsForSubadmin?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        setUnAssignedAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };
    const fetchCompletedAppintmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/getcountsubadmintodayappointment?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        setCompletedAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchSubmittedAppintmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/getcountsubmittedappointmentforSubadmin?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        setSubmittedCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchRejectedAppintmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/countsubadminrejectedappointment?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        setRejectedCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };
    const fetchTodayAppintmentCount = async () => {
      const subadminId = sessionStorage.getItem("subadmin_id"); // Retrieve subadmin_id from sessionStorage

      if (!subadminId) {
        console.error("No subadmin_id found in sessionStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8085/countsubadmintodayappointment?subadmin_id=${subadminId}`,
          { withCredentials: true }
        );

        // Set the count or fallback to 0
        setTodayAppointmentCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    const fetchNullAppointmentCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/getnullappointmentcount",
          { withCredentials: true }
        );
        setAppointmentNullCount(response.data);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    fetchAppointments();
    fetchAppointmentCount();
    fetchLaboratoryCount();
    fetchAssignedAppintmentCount();
    fetchUnAssignedAppintmentCount();
    fetchCompletedAppintmentCount();
    fetchTodayAppintmentCount();
    fetchRejectedAppintmentCount();
    fetchSubmittedAppintmentCount();
    fetchNullAppointmentCount();
  }, []);

  const getAppointmentLink = () => {
    switch (userRole) {
      case "Admin":
        return "/AssignAppointmentToAdmin";
      case "subadmin":
        return "/AssignAppointmentToTechnician";
      case "laboratory":
        return "/AssignAppointmentToAssistant";
      default:
        return "/";
    }
  };

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
                    <li className="breadcrumb-item">
                      <Link to="/SubadminDashboard">Dashboard </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right"></i>
                    </li>
                    <li className="breadcrumb-item active">
                      Sub-Admin Dashboard
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="good-morning-blk">
              <div className="row">
                <div className="col-md-6">
                  <div className="morning-user">
                    <h2>
                      Welcome to <span>Sub-Admin</span> Dashboard
                    </h2>
                    <p>Have a nice day at work</p>
                  </div>
                </div>
                <div className="col-md-6 position-blk">
                  <div className="morning-img">
                    <img src="assets/img/morning-img-01.png" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-block d-md-none">
              <div className="d-flex flex-wrap">
                {/* Assign Appointments & Appointments Buttons */}
                {(userRole === "Admin" ||
                  userRole === "subadmin" ||
                  userRole === "laboratory") && (
                  <div className="d-flex w-100 p-3 justify-content-between">
                    <Link
                      to={getAppointmentLink(userRole)}
                      className="w-50 pe-2"
                    >
                      <button className="w-100 btn btn-light fw-bold rounded-3">
                        Assign Appointments
                      </button>
                    </Link>
                    <Link
                      to={
                        userRole === "Admin"
                          ? "/Appointment"
                          : userRole === "subadmin"
                          ? "/SubadminAppointment"
                          : "/LaboratoryAppointment"
                      }
                      className="w-50 ps-2"
                    >
                      <button className="w-100 btn btn-light fw-bold rounded-3">
                        Appointments
                      </button>
                    </Link>
                  </div>
                )}

                {(userRole === "Admin" || userRole === "subadmin") && (
                  <div className="d-flex w-100 p-3 justify-content-between">
                    {userRole === "Admin" && (
                      <Link to="/subadmin" className="w-50 pe-2">
                        <button className="w-100 btn btn-light fw-bold rounded-3">
                          Sub-Admin Master
                        </button>
                      </Link>
                    )}
                    <Link
                      to={
                        userRole === "Admin"
                          ? "/Adminlaboratory"
                          : "/Subadminlaboratory"
                      }
                      className={`w-50 ${
                        userRole === "Admin" ? "ps-2" : "mx-auto"
                      }`}
                    >
                      <button className="w-100 btn btn-light fw-bold rounded-3">
                        Diagnostic Centre
                      </button>
                    </Link>
                  </div>
                )}

                {/* Technician Button (Laboratory Only) */}
                {userRole === "laboratory" && (
                  <div className="d-flex w-100 p-3 justify-content-between">
                    <Link to="/assistant" className="w-50 pe-2">
                      <button className="w-100 btn btn-light fw-bold rounded-3">
                        Technician
                      </button>
                    </Link>
                  </div>
                )}

                {/* Calendar & Logout Buttons */}
                <div className="d-flex w-100 p-3 justify-content-between">
                  <Link to="/calendar" className="w-50 pe-2">
                    <button className="w-100 btn btn-light fw-bold rounded-3">
                      Calendar
                    </button>
                  </Link>
                  <Link to="/" className="w-50 ps-2">
                    <button className="w-100 btn btn-light fw-bold rounded-3">
                      Logout
                    </button>
                  </Link>
                </div>
                {/* Reports Dropdown */}
                {(userRole === "Admin" ||
                  userRole === "subadmin" ||
                  userRole === "laboratory") && (
                  <div className="w-100 p-3 justify-content-center">
                    <button
                      className="w-100 btn btn-light fw-bold rounded-3"
                      onClick={() => setIsReportsOpen((prev) => !prev)}
                    >
                      Reports
                    </button>
                    {isReportsOpen && (
                      <div className="mt-2 p-2 border rounded">
                        {userRole === "subadmin" && (
                          <Link to="/subadminreport" className="w-50 pe-2">
                            <button className="w-100 btn btn-light fw-bold rounded-3">
                              Sub-Admin Report
                            </button>
                          </Link>
                        )}
                        {userRole === "Admin" && (
                          <Link
                            to="/appointmentreport"
                            className="d-block text-decoration-none p-2"
                          >
                            <button className="w-100 btn btn-light fw-bold rounded-3">
                              Appointment Report
                            </button>
                          </Link>
                        )}
                        {userRole === "laboratory" && (
                          <>
                            <Link
                              to="/diagnosticreport"
                              className="d-block text-decoration-none p-2"
                            >
                              <button className="w-100 btn btn-light fw-bold rounded-3">
                                Diagnostic Report
                              </button>
                            </Link>
                            <Link
                              to="/uploadreport"
                              className="d-block text-decoration-none p-2"
                            >
                              <button className="w-100 btn btn-light fw-bold rounded-3">
                                Upload Report
                              </button>
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/SubadminAppointment">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/calendar.svg" alt="" />
                      </div>
                      <h2>
                        <span>{appointmentCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Appointments</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>40%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/getsubadmintodayappointment">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/calendar.svg" alt="" />
                      </div>
                      <h2>
                        <span>{todayappointmentCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Today Appointments</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>40%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/RejectedSubadminAppointment">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/empty-wallet.svg" alt="" />
                      </div>
                      <h2>
                        <span>{rejectedCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Rejected Appointment</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/SubadminDataMissingAppointment">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/empty-wallet.svg" alt="" />
                      </div>
                      <h2>
                        <span>{appointmentnullCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Data Missing Appointment</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedsubadminappointments/1">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/empty-wallet.svg" alt="" />
                      </div>
                      <h2>
                        <span>{assignedAppointmentCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Assigned Appointment</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedsubadminappointments/2">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/empty-wallet.svg" alt="" />
                      </div>
                      <h2>
                        <span>{unassignedAppointmentCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Unassigned Appointment</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedsubadminappointments/4">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/empty-wallet.svg" alt="" />
                      </div>
                      <h2>
                        <span>{submittedCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Submitted Appointment</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/assignedsubadminappointments/3">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/empty-wallet.svg" alt="" />
                      </div>
                      <h2>
                        <span>{completedAppointmentCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Completed Appointment</h4>

                      {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>30%
                      </span>{" "}
                      vs last month
                    </p> */}
                    </div>
                  </div>
                </Link>
              </div>
              {/* <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <Link to="/laboratory">
                  <div className="dash-widget">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dash-boxs comman-flex-center">
                        <img src="assets/img/icons/calendar.svg" alt="" />
                      </div>
                      <h2>
                        <span>{laboratoryCount}</span>
                      </h2>
                    </div>
                    <div className="dash-content dash-count">
                      <h4>Diagnostic Centre</h4>

                   
                    </div>
                  </div>
                </Link>
              </div> */}

              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <div className="dash-widget">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/profile-add.svg" alt="" />
                    </div>
                    <h2>
                      <span>0</span>
                    </h2>
                  </div>
                  <div className="dash-content dash-count">
                    <h4>Captive Client</h4>

                    {/* <p>
                      <span className="passive-view">
                        <i className="feather-arrow-up-right me-1"></i>20%
                      </span>{" "}
                      vs last month
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                <div className="dash-widget">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="dash-boxs comman-flex-center">
                      <img src="assets/img/icons/scissor.svg" alt="" />
                    </div>
                    <h2>
                      <span>0</span>
                    </h2>
                  </div>
                  <div className="dash-content dash-count">
                    <h4>TPA Client</h4>

                    {/* <p>
                      <span className="negative-view">
                        <i className="feather-arrow-down-right me-1"></i>15%
                      </span>{" "}
                      vs last month
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xl-12">
                <div className="card">
                  <div className="card-header pb-0">
                    <h4 className="card-title d-inline-block">
                      Today Appointments{" "}
                    </h4>{" "}
                    <Link
                      to="/TodayAppointment"
                      className="float-end patient-views"
                    >
                      Show all
                    </Link>
                  </div>
                  <div className="card-block table-dash">
                    <div className="table-responsive">
                      <table className="table mb-0 border-0 datatable custom-table">
                        <thead>
                          <tr>
                            <th>Sr.No</th>
                            <th>Appointment No</th>
                            <th>Patient Name</th>
                            <th>Mobile No</th>
                            <th>Date of Birth</th>
                            <th>Medical test Details</th>
                            {/* <th>Triage</th> */}
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment, index) => (
                            <tr key={appointment.appointment_no}>
                              <td>
                                <h2>{index + 1}</h2>
                              </td>
                              <td>
                                <h2>{appointment.appointment_no}</h2>
                              </td>
                              <td>
                                <h2>{appointment.name}</h2>
                              </td>
                              <td>
                                <h2>{appointment.mobileno}</h2>
                              </td>
                              <td>
                                <h2>
                                  {new Date(appointment.time).toLocaleString(
                                    "en-US",
                                    {
                                      timeZone: "Asia/Kolkata",
                                    }
                                  )}
                                </h2>
                              </td>
                              <td>
                                <h2>{appointment.treatment}</h2>
                              </td>
                              {/* <td>
                                <button className="custom-badge status-green">
                                  Non Urgent
                                </button>
                              </td> */}
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <Link
                                    to="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <Link
                                      className="dropdown-item"
                                      to="edit-patient.html"
                                    >
                                      <i className="fa-solid fa-pen-to-square m-r-5"></i>{" "}
                                      Edit
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_appointment"
                                    >
                                      <i className="fa fa-trash-alt m-r-5"></i>{" "}
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
      </div>
      <div className="sidebar-overlay" data-reff=""></div>
    </div>
  );
}

export default Home;

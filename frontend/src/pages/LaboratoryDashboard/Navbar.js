import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const userRole = sessionStorage.getItem("post");
  const location = useLocation();

  const [isReportsOpen, setIsReportsOpen] = useState(false);

  useEffect(() => {
    const reportPages = [
      "/appointmentreport",
      "/diagnosticreport",
      "/assistantreport",
    ];
    setIsReportsOpen(reportPages.includes(location.pathname));
  }, [location.pathname]);

  const toggleReports = () => {
    setIsReportsOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <div className="header">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            <img src="assets/img/logo.png" width="35" height="35" alt="" />
            <span>Clinic</span>
          </Link>
        </div>
        <Link id="toggle_btn" to="#">
          <img src="assets/img/icons/bar-icon.svg" alt="" />
        </Link>
        <Link id="mobile_btn" className="mobile_btn float-start" to="#sidebar">
          <img src="assets/img/icons/bar-icon.svg" alt="" />
        </Link>
        <ul className="nav user-menu float-end">
          <li className="nav-item dropdown has-arrow user-profile-list">
            <Link
              to="#"
              className="dropdown-toggle nav-Link user-Link"
              data-bs-toggle="dropdown"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span className="user-img">
                <img src="assets/img/user-06.jpg" alt="Admin" />
              </span>
            </Link>
            <div className="dropdown-menu">
              <Link className="dropdown-item" to="/profile">
                My Profile
              </Link>
              <Link className="dropdown-item" to="/">
                Logout
              </Link>
            </div>
          </li>
        </ul>
      </div>

      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">Main {userRole}</li>

              {/* Common for all roles */}
              <li
                className="submenu"
                style={{
                  backgroundColor: isActive("/Dashboard") ? "#f0f0f0" : "",
                  borderLeft: isActive("/Dashboard") ? "5px solid #007bff" : "",
                }}
              >
                <Link to="/Dashboard">
                  <span className="menu-side">
                    <img src="assets/img/icons/menu-icon-01.svg" alt="" />
                  </span>{" "}
                  <span> Dashboard </span>{" "}
                </Link>
              </li>

              {/* Admin & Subadmin Only */}
              {(userRole === "Admin" || userRole === "subadmin") && (
                <>
                  <li
                    className="submenu"
                    style={{
                      backgroundColor: isActive("/Appointment")
                        ? "#f0f0f0"
                        : "",
                      borderLeft: isActive("/Appointment")
                        ? "5px solid #007bff"
                        : "",
                    }}
                  >
                    <Link to="/Appointment">
                      <span className="menu-side">
                        <img src="assets/img/icons/menu-icon-04.svg" alt="" />
                      </span>{" "}
                      <span> Appointments </span>
                    </Link>
                  </li>

                  <li
                    className="submenu"
                    style={{
                      backgroundColor: isActive(
                        "/AssignAppointmentToTechnician"
                      )
                        ? "#f0f0f0"
                        : "",
                      borderLeft: isActive("/AssignAppointmentToTechnician")
                        ? "5px solid #007bff"
                        : "",
                    }}
                  >
                    <Link to="/AssignAppointmentToTechnician">
                      <span className="menu-side">
                        <img src="assets/img/icons/menu-icon-04.svg" alt="" />
                      </span>{" "}
                      <span> Assign Appointments </span>
                    </Link>
                  </li>

                  {/* Sub-Admin Master only for Admin */}
                  {userRole === "Admin" && (
                    <li
                      className="submenu"
                      style={{
                        backgroundColor: isActive("/subadmin") ? "#f0f0f0" : "",
                        borderLeft: isActive("/subadmin")
                          ? "5px solid #007bff"
                          : "",
                      }}
                    >
                      <Link to="/subadmin">
                        <span className="menu-side">
                          <img src="assets/img/icons/menu-icon-04.svg" alt="" />
                        </span>{" "}
                        <span> Sub-Admin Master </span>
                      </Link>
                    </li>
                  )}

                  <li
                    className="submenu"
                    style={{
                      backgroundColor: isActive("/laboratory") ? "#f0f0f0" : "",
                      borderLeft: isActive("/laboratory")
                        ? "5px solid #007bff"
                        : "",
                    }}
                  >
                    <Link to="/laboratory">
                      <span className="menu-side">
                        <img src="assets/img/icons/menu-icon-04.svg" alt="" />
                      </span>{" "}
                      <span> Diagnostic Centre </span>
                    </Link>
                  </li>
                </>
              )}

              {/* Technician Link Only for Laboratory */}
              {userRole === "laboratory" && (
                <li
                  className="submenu"
                  style={{
                    backgroundColor: isActive("/assistant") ? "#f0f0f0" : "",
                    borderLeft: isActive("/assistant")
                      ? "5px solid #007bff"
                      : "",
                  }}
                >
                  <Link to="/assistant">
                    <span className="menu-side">
                      <img src="assets/img/icons/menu-icon-04.svg" alt="" />
                    </span>{" "}
                    <span> Technician </span>
                  </Link>
                </li>
              )}

              {/* Reports Section for Admin, Subadmin, and Laboratory */}
              {(userRole === "Admin" ||
                userRole === "subadmin" ||
                userRole === "laboratory") && (
                <li className="submenu">
                  <Link to="#" onClick={toggleReports}>
                    <span className="menu-side">
                      <img src="assets/img/icons/menu-icon-06.svg" alt="" />
                    </span>
                    <span> Reports </span>
                  </Link>
                  <ul
                    className="submenu-list"
                    style={{
                      display: isReportsOpen ? "block" : "none",
                      paddingLeft: "20px",
                      listStyle: "none",
                    }}
                  >
                    <li
                      style={{
                        margin: "5px 0",
                        backgroundColor: isActive("/appointmentreport")
                          ? "#f0f0f0"
                          : "",
                      }}
                    >
                      <Link to="/appointmentreport">Appointment Report</Link>
                    </li>
                    <li
                      style={{
                        margin: "5px 0",
                        backgroundColor: isActive("/diagnosticreport")
                          ? "#f0f0f0"
                          : "",
                      }}
                    >
                      <Link to="/diagnosticreport">Diagnostic Report</Link>
                    </li>
                    <li
                      style={{
                        margin: "5px 0",
                        backgroundColor: isActive("/assistantreport")
                          ? "#f0f0f0"
                          : "",
                      }}
                    >
                      <Link to="/assistantreport">Technician Report</Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Calendar for all roles */}
              <li
                className="submenu"
                style={{
                  backgroundColor: isActive("/calendar") ? "#f0f0f0" : "",
                  borderLeft: isActive("/calendar") ? "5px solid #007bff" : "",
                }}
              >
                <Link to="/calendar">
                  <span className="menu-side">
                    <img src="assets/img/icons/menu-icon-05.svg" alt="" />
                  </span>{" "}
                  <span> Calendar </span>{" "}
                </Link>
              </li>

              {/* Logout for all roles */}
              <li className="logout-btn">
                <Link
                  to="/"
                  style={{
                    backgroundColor: isActive("/") ? "#f0f0f0" : "",
                    borderLeft: isActive("/") ? "5px solid #007bff" : "",
                  }}
                >
                  <span className="menu-side">
                    <img src="assets/img/icons/logout.svg" alt="" />
                  </span>{" "}
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const userRole = sessionStorage.getItem("post");
  const location = useLocation();

  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const reportPages = [
      "/appointmentreport",
      "/diagnosticreport",
      "/assistantreport",
    ];

    // Open reports menu only when on a report page
    setIsReportsOpen(reportPages.includes(location.pathname));
  }, [location.pathname]);

  const toggleReports = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsReportsOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    document.body.classList.toggle("sidebar-open");
  };

  const isActive = (path) => location.pathname === path;

  const getAppointmentLink = (userRole) => {
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
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="logo">
            <img src="/assets/img/logo.png" width="35" height="35" alt="" />
            <span>Clinic</span>
          </div>
        </div>
        {/* <Link id="toggle_btn" onClick={toggleSidebar}>
          <img src="assets/img/icons/bar-icon.svg" alt="" />
        </Link> */}
        <Link
          id="mobile_btn"
          className="mobile_btn float-start"
          onClick={toggleSidebar}
        >
          <img src="/assets/img/icons/bar-icon.svg" alt="" />
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
                <img src="/assets/img/user-06.jpg" alt="Admin" />
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

      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        id="sidebar"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">Main {userRole}</li>

              {/* Dashboard */}
              <li className={isActive("/dashboard") ? "active" : ""}>
                <Link
                  to={
                    userRole === "subadmin"
                      ? "/SubadminDashboard"
                      : userRole === "laboratory"
                      ? "/LaboratoryDashboard"
                      : "/dashboard"
                  }
                >
                  <span className="menu-side">
                    <img src="/assets/img/icons/menu-icon-01.svg" alt="" />
                  </span>
                  <span> Dashboard </span>
                </Link>
              </li>

              {/* Assign Appointments */}
              <li
                className={
                  [
                    "/AssignAppointmentToAssistant",
                    "/AssignAppointmentToTechnician",
                    "/AssignAppointmentToAdmin",
                  ].some(isActive)
                    ? "active"
                    : ""
                }
              >
                <Link to={getAppointmentLink(userRole)}>
                  <span className="menu-side">
                    <img src="/assets/img/icons/menu-icon-04.svg" alt="" />
                  </span>
                  <span> Assign Appointments </span>
                </Link>
              </li>

              {/* Admin & Subadmin Only */}
              {/* Appointments for Different Roles */}
              {(userRole === "Admin" ||
                userRole === "subadmin" ||
                userRole === "laboratory") && (
                <li
                  className={
                    isActive(
                      userRole === "Admin"
                        ? "/Appointment"
                        : userRole === "subadmin"
                        ? "/SubadminAppointment"
                        : "/LaboratoryAppointment"
                    )
                      ? "active"
                      : ""
                  }
                >
                  <Link
                    to={
                      userRole === "Admin"
                        ? "/Appointment"
                        : userRole === "subadmin"
                        ? "/SubadminAppointment"
                        : "/LaboratoryAppointment"
                    }
                  >
                    <span className="menu-side">
                      <img src="/assets/img/icons/menu-icon-04.svg" alt="" />
                    </span>
                    <span>
                      {userRole === "Admin"
                        ? "Appointments"
                        : userRole === "subadmin"
                        ? "Appointments"
                        : "Appointments"}
                    </span>
                  </Link>
                </li>
              )}

              {userRole === "Admin" && (
                <li className={isActive("/subadmin") ? "active" : ""}>
                  <Link to="/subadmin">
                    <span className="menu-side">
                      <img src="/assets/img/icons/menu-icon-04.svg" alt="" />
                    </span>
                    <span> Sub-Admin Master </span>
                  </Link>
                </li>
              )}

              {/* Diagnostic Centre */}
              {(userRole === "Admin" || userRole === "subadmin") && (
                <li
                  className={
                    isActive(
                      userRole === "Admin"
                        ? "/Adminlaboratory"
                        : "/Subadminlaboratory"
                    )
                      ? "active"
                      : ""
                  }
                >
                  <Link
                    to={
                      userRole === "Admin"
                        ? "/Adminlaboratory"
                        : "/Subadminlaboratory"
                    }
                  >
                    <span className="menu-side">
                      <img src="/assets/img/icons/menu-icon-04.svg" alt="" />
                    </span>
                    <span> Diagnostic Centre </span>
                  </Link>
                </li>
              )}

              {/* Technician Link */}
              {userRole === "laboratory" && (
                <li className={isActive("/assistant") ? "active" : ""}>
                  <Link to="/assistant">
                    <span className="menu-side">
                      <img src="/assets/img/icons/menu-icon-04.svg" alt="" />
                    </span>
                    <span> Technician </span>
                  </Link>
                </li>
              )}

              {/* Reports Section */}

              {(userRole === "Admin" ||
                userRole === "subadmin" ||
                userRole === "laboratory") && (
                <li className={`submenu ${isReportsOpen ? "open" : ""}`}>
                  <Link
                    to="#"
                    onClick={toggleReports}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="menu-side">
                        <img src="/assets/img/icons/menu-icon-06.svg" alt="" />
                      </span>
                      <span> Reports </span>
                    </div>
                    <span>{isReportsOpen ? "▲" : "▼"}</span>
                  </Link>
                  <ul
                    className={`submenu-list ${
                      isReportsOpen ? "show" : "hide"
                    }`}
                    style={{ display: isReportsOpen ? "block" : "none" }}
                  >
                    <li
                      className={isActive("/appointmentreport") ? "active" : ""}
                    >
                      <Link to="/appointmentreport">Appointment Report</Link>
                    </li>
                    <li
                      className={isActive("/diagnosticreport") ? "active" : ""}
                    >
                      <Link to="/diagnosticreport">Diagnostic Report</Link>
                    </li>
                    <li
                      className={isActive("/assistantreport") ? "active" : ""}
                    >
                      <Link to="/assistantreport">Technician Report</Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Calendar */}
              <li className={isActive("/calendar") ? "active" : ""}>
                <Link to="/calendar">
                  <span className="menu-side">
                    <img src="/assets/img/icons/menu-icon-05.svg" alt="" />
                  </span>
                  <span> Calendar </span>
                </Link>
              </li>

              {/* Logout */}
              <li className="logout-btn">
                <Link to="/">
                  <span className="menu-side">
                    <img src="/assets/img/icons/logout.svg" alt="" />
                  </span>
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

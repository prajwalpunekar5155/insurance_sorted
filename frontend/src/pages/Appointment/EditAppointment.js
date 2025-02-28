// Code by Prajwal Punekar

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [insurance_name, setInsurance_name] = useState("");
  const [tpa_details, setTpa_details] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageError, setMessageError] = useState(""); // State to track message validation error

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/getAppointmentById/${id}`
        );
        const data = await response.json();

        // Format the fetched time
        const formattedTime = formatDateTime(data.time);
        setAppointment(data);
        setTime(formattedTime); // Set formatted time
        setTreatment(data.address);
        setTreatment(data.country);
        setTreatment(data.state);
        setTreatment(data.city);
        setTreatment(data.pincode);
        setTreatment(data.insurance_name);
        setTreatment(data.tpa_details);
        setTreatment(data.treatment);
        setMessage(data.message || ""); // Default empty if no message
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  // Function to format the fetched time
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");

    const formattedTime =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      ":" +
      date.getSeconds().toString().padStart(2, "0");

    return `${formattedDate} ${formattedTime}`;
  };

  const handleSave = async () => {
    if (!time.trim() || !treatment.trim()) {
      alert("Time and Treatment fields cannot be empty!");
      return;
    }

    if (message.trim().length < 5) {
      // Check if the message length is less than 5 characters
      setMessageError("Message must be at least 5 characters long.");
      return;
    } else {
      setMessageError(""); // Clear the error message if validation is passed
    }

    try {
      const response = await fetch(
        `http://localhost:8085/updateAppointment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            time,
            treatment,
            message,
          }),
        }
      );

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        const errorMessage = await response.text();
        alert(`Failed to save changes: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("An error occurred while saving the changes.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/appointment");
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
     
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "30px",
        }}
      >
        <div style={{display:'flex', justifyContent:'flex-end'}}>
        <IconButton  onClick={() => window.history.back()} color="primary">
        <CloseIcon />
        </IconButton>
        </div>
        <h2
          style={{
            marginBottom: "20px",
            color: "#4e73df",
            textAlign: "center",
          }}
        >
          Edit Appointment
        </h2>

        {appointment ? (
          <>
            <div
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
              }}
            >
              <p>
                <strong>Appointment No:</strong> {appointment.appointment_no}
              </p>
              <p>
                <strong>Name:</strong> {appointment.name}
              </p>
              <p>
                <strong>Contact:</strong> {appointment.mobileno}
              </p>
              <p>
                <strong>Address:</strong> {appointment.address}
              </p>
              <p>
                <strong>Country:</strong> {appointment.country}
              </p>
              <p>
                <strong>State:</strong> {appointment.state}
              </p>
              <p>
                <strong>City:</strong> {appointment.city}
              </p>
              <p>
                <strong>Pincode:</strong> {appointment.pincode}
              </p>
              <p>
                <strong>Insurance Name:</strong> {appointment.insurance_name}
              </p>
              <p>
                <strong>TPA Details:</strong> {appointment.tpa_details}
              </p>
            </div>

            {/* Time Field */}
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Time:
            </label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            {/* Treatment Field */}
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Treatment:
            </label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Enter treatment details"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            {/* Message Field */}
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message"
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "20px",
                resize: "none",
              }}
            ></textarea>
            {messageError && (
              <p style={{ color: "red", fontSize: "0.9rem" }}>{messageError}</p>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                backgroundColor: "#2E37A4",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#375abe")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4e73df")}
            >
              Save Changes
            </button>
          </>
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>
            Loading appointment details...
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "#4e73df" }}>
              Appointment Updated Successfully!
            </h3>
            <button
              onClick={closeModal}
              style={{
                padding: "8px 16px",
                fontSize: "1rem",
                backgroundColor: "#4e73df",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAppointment;

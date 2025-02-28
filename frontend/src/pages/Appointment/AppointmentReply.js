// Code by Prajwal Punekar

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AppointmentReply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment } = location.state || {};
  const [reply, setReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      alert("Reply cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8085/addReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_no: appointment.appointment_no,
          name: appointment.name,
          mobileno: appointment.mobileno,
          treatment: appointment.treatment,
          time: appointment.time,
          reply: reply,
        }),
      });

      if (response.ok) {
        setIsModalOpen(true);
        setReply("");
      } else {
        const errorMessage = await response.text();
        alert(`Failed to submit reply: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the reply.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/Appointment");
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
        <h2
          style={{
            marginBottom: "20px",
            color: "#4e73df",
            textAlign: "center",
          }}
        >
          Reply to Appointment
        </h2>
        {appointment ? (
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
              <strong>Treatment:</strong> {appointment.treatment}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.time).toLocaleString()}
            </p>
          </div>
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>
            No appointment details available.
          </p>
        )}
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Enter your reply here"
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
        <button
          onClick={handleReplySubmit}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            backgroundColor: "#4e73df",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#375abe")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4e73df")}
        >
          Submit Reply
        </button>
      </div>

      {/* Modal Component */}
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
              Reply Submitted Successfully!
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

export default AppointmentReply;

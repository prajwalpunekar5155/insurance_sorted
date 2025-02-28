// Code by Prajwal Punekar

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "../navBar";

const AddRole = () => {
  const [formData, setFormData] = useState({
    role: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const navigate = useNavigate(); // Use navigate for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { role } = formData;

    if (!role) {
      return "All fields are required!";
    }
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8085/addRole", // Updated API endpoint
        formData
      );
      setMessage(response.data);

      // Show modal after success
      setShowModal(true);

      // Reset the form after submission
      setFormData({
        role: "",
      });

      // Navigate to the Assistant page after 2 seconds (to give time for the modal to show)
      setTimeout(() => {
        navigate("/role"); // Navigate to the assistant page
      }, 4000);
    } catch (err) {
      setError(err.response?.data || "Failed to add assistant");
    }
  };

  // Close the modal and navigate to the Assistant page
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/role"); // Navigate to the assistant page when closing the modal
  };

  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "20px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            Add Role
          </h2>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              maxWidth: "100%",
            }}
          >
            {/* First Row: 2 Fields */}
            {[{ name: "role", type: "text", placeholder: "Role", row: 1 }].map(
              (field) => (
                <div
                  key={field.name}
                  style={{
                    flex:
                      field.row === 2
                        ? "1 1 calc(50% - 20px)"
                        : "1 1 calc(50% - 20px)",
                    minWidth: "200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              )
            )}

            {/* Submit Button */}
            <div
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#2E37A4",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add Role
              </button>
            </div>
          </form>

          {/* Success/Error Message */}
          {message && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              {message}
            </p>
          )}
          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
              {error}
            </p>
          )}
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

      {/* Modal for successful addition */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3>Role Added Successfully!</h3>
            <p>Your role has been added successfully.</p>
            <button
              onClick={handleCloseModal} // Call the function to close the modal and navigate
              style={{
                padding: "10px 20px",
                backgroundColor: "#2E37A4",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "20px",
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

export default AddRole;

// Code by Prajwal Punekar

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Error state for each field
  const [fieldErrors, setFieldErrors] = useState({
    role: "",
  });

  useEffect(() => {
    const fetchAssistantDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8085/getRoleById/${id}`);
        const data = await response.json();

        // Populate form fields with fetched data
        if (data) {
          setFormData({
            role: data.role,
          });
        }
      } catch (error) {
        console.error("Failed to fetch assistant details:", error);
      }
    };

    fetchAssistantDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: "", // Clear the error when user starts typing
    });
  };

  const validateForm = () => {
    const { role } = formData;
    const errors = {};

    // Check for empty fields
    if (!role) errors.role = "Role is required!";

    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Validate the form and set errors
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8085/updateRole/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message); // Access the message field from the JSON response
        setIsModalOpen(true);
      } else {
        setError(result.message); // Access the message field from the JSON response
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError("An error occurred while updating the role.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/role");
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
          Edit Role
        </h2>

        {/* Form */}
        <form onSubmit={handleSave}>
          {/* Name */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Role:
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter role"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.role && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.role}
            </p>
          )}

          {/* Save Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#2E37A4",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </form>

        {/* Success Modal */}
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
                Assistant Updated Successfully!
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
    </div>
  );
};

export default EditRole;

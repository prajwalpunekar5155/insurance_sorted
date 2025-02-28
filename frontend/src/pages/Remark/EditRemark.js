import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditAssistant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    remark: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Error state for each field
  const [fieldErrors, setFieldErrors] = useState({
    remark: "",
  });

  useEffect(() => {
    const fetchAssistantDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/gettestremarkbyid/${id}`
        );
        const data = await response.json();

        // Populate form fields with fetched data
        if (data) {
          setFormData({
            remark: data.remark,
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
    const { remark } = formData;
    const newErrors = {};

    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!remark) {
      newErrors.remark = "Remark is required!";
    } else if (!nameRegex.test(remark)) {
      newErrors.remark = "Remark must contain only letters and spaces.";
    }

    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8085/updatetestremark/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || result); // ✅ Ensures a string
        setIsModalOpen(true);
      } else {
        setError(result.message || result); // ✅ Ensures a string
      }
    } catch (error) {
      console.error("Error updating assistant:", error);
      setError("An error occurred while updating the assistant.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/remark");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={() => window.history.back()} color="primary">
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
          Edit Remark
        </h2>

        {/* Form */}
        <form onSubmit={handleSave}>
          {/* Name */}

          {/* Username */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Remark:
          </label>
          <input
            type="text"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            placeholder="Enter remark"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.remark && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.remark}
            </p>
          )}

          {/* Error Message */}
          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

          {/* Save Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#4e73df",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "5px",
            }}
          >
            <p>{message}</p>
            <button
              onClick={closeModal}
              style={{
                padding: "10px",
                backgroundColor: "#155724",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAssistant;

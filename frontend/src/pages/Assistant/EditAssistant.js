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
    name: "",
    mobileno: "",
    email: "",
    pincode: "", // Added pincode field
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Error state for each field
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    mobileno: "",
    email: "",
    pincode: "", // Added error state for pincode
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchAssistantDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/getAssistantById/${id}`
        );
        const data = await response.json();

        // Populate form fields with fetched data
        if (data) {
          setFormData({
            name: data.name,
            mobileno: data.mobileno,
            email: data.email,
            pincode: data.pincode, // Set pincode
            username: data.username,
            password: data.password,
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
    const { name, mobileno, email, pincode, username, password } = formData;
    const newErrors = {};

    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) {
      newErrors.name = "Name is required!";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    // Mobile number validation
    if (!mobileno) {
      newErrors.mobileno = "Mobile number is required!";
    } else if (!/^[0-9]{10}$/.test(mobileno)) {
      newErrors.mobileno = "Mobile number must be 10 digits.";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required!";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Pincode validation (only numeric and 6 digits)
    if (!pincode) {
      newErrors.pincode = "Pincode is required!";
    } else if (!/^[0-9]{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be 6 digits.";
    }

    // Username and password validation
    if (!username) newErrors.username = "Username is required!";
    if (!password) newErrors.password = "Password is required!";

    return newErrors;
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
      const response = await fetch(
        `http://localhost:8085/updateAssistant/${id}`,
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
        setMessage(result);
        setIsModalOpen(true);
      } else {
        setError(result);
      }
    } catch (error) {
      console.error("Error updating assistant:", error);
      setError("An error occurred while updating the assistant.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/assistant");
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
          Edit Technician
        </h2>

        {/* Form */}
        <form onSubmit={handleSave}>
          {/* Name */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.name && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.name}
            </p>
          )}

          {/* Mobile Number */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Mobile Number:
          </label>
          <input
            type="text"
            name="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
            placeholder="Enter mobile number"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.mobileno && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.mobileno}
            </p>
          )}

          {/* Email */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.email && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.email}
            </p>
          )}

          {/* Pincode */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Pincode:
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.pincode && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.pincode}
            </p>
          )}

          {/* Username */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {fieldErrors.username && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.username}
            </p>
          )}

          {/* Password */}
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Password:
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <IconButton
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
              }}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </div>
          {fieldErrors.password && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>
              {fieldErrors.password}
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

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

    // Pincode validation
    if (!pincode) {
      newErrors.pincode = "Pincode is required!";
    } else {
      // Split pincodes by comma and validate each one
      const pincodeArray = pincode.split(",").map((pin) => pin.trim());

      for (let pin of pincodeArray) {
        if (!/^\d{6}$/.test(pin)) {
          newErrors.pincode =
            "Each pincode must be exactly 6 digits and only contain numbers.";
          break; // Stop validation on first invalid pincode
        }
      }
    }

    // Username and password validation
    if (!username) newErrors.username = "Username is required!";
    if (!password) newErrors.password = "Password is required!";

    return newErrors;
  };
  const handleChangePincode = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      // Remove non-numeric characters
      let cleanedValue = value.replace(/\D/g, "");

      // Add commas after every 6 digits
      let formattedValue = cleanedValue.replace(/(\d{6})(?=\d)/g, "$1,");

      setFormData({
        ...formData,
        pincode: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setError({
      ...error,
      [name]: "", // Clear error for the field being edited
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Validate the form and set error
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
      className="main-wrapper"
      style={{
        border: "2px solid",
        borderRadius: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
        backgroundColor: "#fff",
      }}
    >
      {/* <div className="page-wrapper"> */}
      <div style={{ flex: 1, backgroundColor: "#fff", paddingBottom: "10px" }}>
        <div
          style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}
        >
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
          Update Technician Details
        </h2>

        <form
          onSubmit={handleSave}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="name" style={{ fontWeight: "bold" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {error.name && (
                <p style={{ color: "red", fontSize: "12px" }}>{error.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="mobileno" style={{ fontWeight: "bold" }}>
                Mobile Number
              </label>
              <input
                type="number"
                name="mobileno"
                value={formData.mobileno}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {error.mobileno && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {error.mobileno}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="email" style={{ fontWeight: "bold" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {error.email && (
                <p style={{ color: "red", fontSize: "12px" }}>{error.email}</p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            {/* Username */}
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="username" style={{ fontWeight: "bold" }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {error.username && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {error.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="password" style={{ fontWeight: "bold" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {error.password && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {error.password}
                </p>
              )}
            </div>
            {/* Pincode */}
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="pincode" style={{ fontWeight: "bold" }}>
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                placeholder="Enter multiple pincodes"
                value={formData.pincode}
                onChange={handleChangePincode}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {error.pincode && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {error.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
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
              Add Technician
            </button>
          </div>
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

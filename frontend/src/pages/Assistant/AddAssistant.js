import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddAssistant = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileno: "",
    email: "",
    username: "",
    password: "",
    pincode: "", // Added pincode field
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "", // Clear error for the field being edited
    });
  };

  const validateForm = () => {
    const { name, mobileno, email, username, password, pincode } = formData;
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

    // Username and password validation
    if (!username) newErrors.username = "Username is required!";
    if (!password) newErrors.password = "Password is required!";

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

    setErrors({
      ...errors,
      [name]: "", // Clear error for the field being edited
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get token_key from sessionStorage
    const tokenKey = sessionStorage.getItem("tokenKey");

    try {
      // Add token_key to form data
      const response = await axios.post(
        "http://localhost:8085/addAssistant",
        { ...formData, token_key: tokenKey } // Include token_key
      );
      setMessage(response.data);

      setShowModal(true);

      setFormData({
        name: "",
        mobileno: "",
        email: "",
        username: "",
        password: "",
        pincode: "", // Reset pincode field
      });

      setTimeout(() => {
        navigate("/assistant");
      }, 4000);
    } catch (err) {
      setMessage("");
      setErrors({ form: err.response?.data || "Failed to add assistant" });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/assistant");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <IconButton onClick={() => window.history.back()} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <h2>Add Technician</h2>
          </div>

          <form
            onSubmit={handleSubmit}
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
                {errors.name && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.name}
                  </p>
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
                {errors.mobileno && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.mobileno}
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
                {errors.email && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.email}
                  </p>
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
                {errors.username && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.username}
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
                {errors.password && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.password}
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
                {errors.pincode && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.pincode}
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

          {message && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              {message}
            </p>
          )}
          {errors.form && (
            <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
              {errors.form}
            </p>
          )}
        </div>
      </div>

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
            <h3>Technician Added Successfully!</h3>

            <button
              onClick={handleCloseModal}
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

export default AddAssistant;

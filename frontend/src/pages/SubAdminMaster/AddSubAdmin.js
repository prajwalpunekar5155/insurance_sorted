import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SubAdminMaster = () => {
  const [formData, setFormData] = useState({
    name: "",
    mname: "",
    lname: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    address: "",
    mobileno: "",
    email: "",
    username: "",
    password: "",
  });

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

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
    const {
      name,
      mname,
      lname,
      country,
      state,
      city,
      pincode,
      address,
      mobileno,
      email,
      username,
      password,
    } = formData;

    const newErrors = {};

    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) {
      newErrors.name = "Name is required!";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    if (!mname) {
      newErrors.mname = "Middle Name is required!";
    } else if (!nameRegex.test(mname)) {
      newErrors.mname = "Middle Name must contain only letters and spaces.";
    }

    if (!lname) {
      newErrors.lname = "Name is required!";
    } else if (!nameRegex.test(lname)) {
      newErrors.lname = "Name must contain only letters and spaces.";
    }

    // Mobile number validation
    if (!mobileno) {
      newErrors.mobileno = "Mobile number is required!";
    } else if (!/^[0-9]{10}$/.test(mobileno)) {
      newErrors.mobileno = "Mobile number must be 10 digits.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
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

    // Address validation
    if (!address) {
      newErrors.address = "Address is required!";
    }

    // Country, State, City validation (required)
    if (!country) newErrors.country = "Country is required!";
    if (!state) newErrors.state = "State is required!";
    if (!city) newErrors.city = "City is required!";

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

    try {
      const response = await axios.post(
        "http://localhost:8085/addSubadmin",
        formData
      );

      setMessage(response.data); // ✅ Set only the message

      // Show modal after success
      setShowModal(true);

      // Reset the form after submission
      setFormData({
        name: "",
        mname: "",
        lname: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        address: "",
        mobileno: "",
        email: "",
        username: "",
        password: "",
      });

      // Navigate to the subadmin page after 2 seconds
      setTimeout(() => {
        navigate("/subadmin");
      }, 4000);
    } catch (err) {
      setMessage("");
      setErrors({
        form: err.response?.data || "Failed to add subadmin",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/subadmin");
  };

  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            <IconButton onClick={() => window.history.back()} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <h2>Add Sub-Admin</h2>
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
              {/* First Name */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label htmlFor="name" style={{ fontWeight: "bold" }}>
                  First Name
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

              {/* Middle Name */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label htmlFor="mname" style={{ fontWeight: "bold" }}>
                  Middle Name
                </label>
                <input
                  type="text"
                  name="mname"
                  value={formData.mname}
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
                {errors.mname && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.mname}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label htmlFor="lname" style={{ fontWeight: "bold" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
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
                {errors.lname && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.lname}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div style={{ width: "100%" }}>
              <label htmlFor="address" style={{ fontWeight: "bold" }}>
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  resize: "none",
                  fontSize: "14px",
                  height: "80px",
                }}
              ></textarea>
              {errors.address && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.address}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "20px", width: "100%" }}>
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
            </div>

            {/* Country, State, City, Pincode */}
            <div style={{ display: "flex", gap: "20px", width: "100%" }}>
              {/* Country */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label htmlFor="country" style={{ fontWeight: "bold" }}>
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly // Prevents modification
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "#f2f2f2", // Light gray to indicate read-only
                    cursor: "not-allowed",
                  }}
                />
                {errors.country && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.country}
                  </p>
                )}
              </div>
              {/* State Dropdown */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label htmlFor="state" style={{ fontWeight: "bold" }}>
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.state}
                  </p>
                )}
              </div>

              {/* City */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label htmlFor="city" style={{ fontWeight: "bold" }}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
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
                {errors.city && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.city}
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Sub-Admin added Successfully</h3>
            {/* <p>{message}</p> */}
            <button
              onClick={handleCloseModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2E37A4",
                color: "white",
                border: "none",
                borderRadius: "6px",
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

export default SubAdminMaster;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditLaboratory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    name: "",
    mobileno: "",
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Error state for each field
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    name: "",
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/getLaboratoryById/${id}`
        );
        const data = await response.json();

        if (data) {
          setFormData({
            title: data.title,
            country: data.country,
            state: data.state,
            city: data.city,
            pincode: data.pincode,
            address: data.address,
            name: data.name || "",
            mobileno: data.mobileno || "",
            email: data.email || "",
            username: data.username || "",
            password: data.password || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch details:", error);
      }
    };

    fetchDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const {
      title,
      country,
      state,
      city,
      pincode,
      address,
      name,
      mobileno,
      email,
      username,
      password,
    } = formData;
    const errors = {};

    // Validation for existing fields
    if (!title) errors.title = "Title is required!";
    if (!country) errors.country = "Country is required!";
    if (!state) errors.state = "State is required!";
    if (!city) errors.city = "City is required!";
    if (!address) errors.address = "Address is required!";
    // Pincode validation
    if (!pincode) {
      errors.pincode = "Pincode is required!";
    } else {
      // Split pincodes by comma and validate each one
      const pincodeArray = pincode.split(",").map((pin) => pin.trim());

      for (let pin of pincodeArray) {
        if (!/^\d{6}$/.test(pin)) {
          errors.pincode =
            "Each pincode must be exactly 6 digits and only contain numbers.";
          break; // Stop validation on first invalid pincode
        }
      }
    }

    // Validation for new fields
    if (!name) errors.name = "Name is required!";
    if (!mobileno) errors.mobileno = "Mobile number is required!";
    if (!email) errors.email = "Email is required!";
    if (!username) errors.username = "Username is required!";
    if (!password) errors.password = "Password is required!";

    return errors;
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
      ...errors,
      [name]: "", // Clear error for the field being edited
    });
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
        `http://localhost:8085/updateLaboratory/${id}`,
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
      console.error("Error updating details:", error);
      setError("An error occurred while updating the details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/Adminlaboratory");
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
          Update Diagnostic Centre Details
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
                Centre Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
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
              {errors.title && (
                <p style={{ color: "red", fontSize: "12px" }}>{errors.title}</p>
              )}
            </div>

            <div style={{ flex: "1", minWidth: "200px" }}>
              <label htmlFor="name" style={{ fontWeight: "bold" }}>
                Owner Name
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
                <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
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
                <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>
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
              <p style={{ color: "red", fontSize: "12px" }}>{errors.address}</p>
            )}
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
                <p style={{ color: "red", fontSize: "12px" }}>{errors.state}</p>
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
                <p style={{ color: "red", fontSize: "12px" }}>{errors.city}</p>
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
                Details Updated Successfully!
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

export default EditLaboratory;

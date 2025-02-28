import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditSubAdminMaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Error state for each field
  const [fieldErrors, setFieldErrors] = useState({
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/getSubadminById/${id}`
        );
        const data = await response.json();

        if (data) {
          setFormData({
            name: data.name || "",
            mname: data.mname || "",
            lname: data.lname || "",
            country: data.country,
            state: data.state,
            city: data.city,
            pincode: data.pincode,
            address: data.address,

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
    const errors = {};

    // Validation for existing fields
    if (!name) errors.name = "First name is required!";
    if (!mname) errors.mname = "Middle name is required!";
    if (!lname) errors.lname = "Last name is required!";
    if (!country) errors.country = "Country is required!";
    if (!state) errors.state = "State is required!";
    if (!city) errors.city = "City is required!";
    if (!pincode) errors.pincode = "Pincode is required!";
    if (!address) errors.address = "Address is required!";
    if (pincode && (isNaN(pincode) || pincode.length !== 6)) {
      errors.pincode = "Pincode must be a 6-digit number.";
    }

    if (!mobileno) errors.mobileno = "Mobile number is required!";
    if (!email) errors.email = "Email is required!";
    if (!username) errors.username = "Username is required!";
    if (!password) errors.password = "Password is required!";

    return errors;
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
        `http://localhost:8085/updateSubadmin/${id}`,
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
    navigate("/subadmin");
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
          Edit Sub-Admin
        </h2>
        <form onSubmit={handleSave}>
          {/* Existing Fields */}
          {[
            "name",
            "mname",
            "lname",
            "country",
            "state",
            "city",
            "pincode",
            "address",

            "mobileno",
            "email",
            "username",
            "password",
          ].map((field) => (
            <div key={field}>
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  textTransform: "capitalize",
                }}
              >
                {field.replace("_", " ")}:
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replace("_", " ")}`}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              {fieldErrors[field] && (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {fieldErrors[field]}
                </p>
              )}
            </div>
          ))}

          {/* Error Message */}
          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

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

export default EditSubAdminMaster;

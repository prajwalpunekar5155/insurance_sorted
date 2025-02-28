import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddAssistant = () => {
  const [formData, setFormData] = useState({
    remark: "",
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
        "http://localhost:8085/addtestremark",
        { ...formData } 
      );
      setMessage(response.data);

      setShowModal(true);

      setFormData({
        remark: "",
      });

      setTimeout(() => {
        navigate("/remark");
      }, 4000);
    } catch (err) {
      setMessage("");
      setErrors({ form: err.response?.data || "Failed to add Remark" });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/remark");
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
            <h2>Add Remark</h2>
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
              {/* Username */}
              <div style={{ flex: "1", minWidth: "200px" }}>
                {/* <label htmlFor="remark" style={{ fontWeight: "bold" }}>
                  Remark
                </label> */}
                <input
                  type="text"
                  name="remark"
                  value={formData.remark}
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
                {errors.remark && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.remark}
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
                Add Remark
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
            <h3>Remark Added Successfully!</h3>

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

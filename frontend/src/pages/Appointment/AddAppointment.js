import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navBar";

const AddAppointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    date_: "", // Renamed to date_ as expected by backend
    time_: "", // Renamed to time_ as expected by backend
    treatment: "",
    mobileno: "",
    appointment_no: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    insurance_name: "",
    tpa_details: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const {
      name,
      date_,
      time_,
      treatment,
      mobileno,
      appointment_no,
      country,
      state,
      city,
      pincode,
      address,
      insurance_name,
      tpa_details,
    } = formData;

    if (
      !name ||
      !date_ ||
      !time_ ||
      !treatment ||
      !mobileno ||
      !appointment_no ||
      !country ||
      !state ||
      !city ||
      !pincode ||
      !address ||
      !insurance_name ||
      !tpa_details
    ) {
      return "All fields are required!";
    }

    if (isNaN(pincode) || pincode.length !== 6) {
      return "Pincode must be a 6-digit number.";
    }

    if (isNaN(mobileno) || mobileno.length !== 10) {
      return "Mobile number must be a 10-digit number.";
    }

    return null;
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
        "http://localhost:8085/addAppointment", // Make sure the backend URL is correct
        formData
      );
      setMessage(response.data);
      setShowModal(true);
      setFormData({
        name: "",
        date_: "",
        time_: "",
        treatment: "",
        mobileno: "",
        appointment_no: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        address: "",
        insurance_name: "",
        tpa_details: "",
      });
      setTimeout(() => {
        navigate("/appointment");
      }, 4000);
    } catch (err) {
      setError(err.response?.data || "Failed to add appointment");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/appointment");
  };

  return (
    <div className="main-wrapper">
      <Navbar />
      <div className="page-wrapper" style={{ marginTop: "50px" }}>
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "20px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            Add Appointment
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              maxWidth: "100%",
            }}
          >
            {[
              // Fields array remains the same
              { name: "name", type: "text", placeholder: "Name" },
              { name: "date_", type: "date", placeholder: "Date" },
              { name: "time_", type: "time", placeholder: "Time" },
              { name: "treatment", type: "text", placeholder: "Treatment" },
              {
                name: "mobileno",
                type: "number",
                placeholder: "Mobile Number",
              },
              {
                name: "appointment_no",
                type: "text",
                placeholder: "Appointment No.",
              },
              { name: "country", type: "text", placeholder: "Country" },
              { name: "state", type: "text", placeholder: "State" },
              { name: "city", type: "text", placeholder: "City" },
              { name: "pincode", type: "number", placeholder: "Pincode" },
              { name: "address", type: "textarea", placeholder: "Address" },
              {
                name: "insurance_name",
                type: "text",
                placeholder: "Insurance Name",
              },
              { name: "tpa_details", type: "text", placeholder: "TPA Details" },
            ].map((field) => (
              <div
                key={field.name}
                style={{
                  flex:
                    field.name === "address"
                      ? "1 1 100%"
                      : "1 1 calc(33.33% - 20px)",
                  minWidth: field.name === "address" ? "100%" : "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      resize: "none",
                      fontSize: "14px",
                      height: "80px",
                    }}
                  ></textarea>
                ) : (
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
                )}
              </div>
            ))}

            <div
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
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
                Add Appointment
              </button>
            </div>
          </form>

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
                <h3>Appointment Added Successfully!</h3>
                <p>Your appointment has been added successfully.</p>
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
    </div>
  );
};

export default AddAppointment;

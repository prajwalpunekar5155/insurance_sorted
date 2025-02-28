// Code by Prajwal Punekar

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import axiosInstance from "./utils/interface";

const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "#ff0", fontWeight: "bold" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const EventDetailsPage = () => {
  const { date } = useParams();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/getallappointment",
          { withCredentials: true }
        );
        const eventsOnDate = response.data.filter(
          (event) =>
            moment(event.time, "DD/MM/YYYY hh:mm A").format("YYYY-MM-DD") ===
            date
        );
        const sortedEvents = eventsOnDate.sort((a, b) =>
          moment(a.time, "DD/MM/YYYY hh:mm A").isBefore(
            moment(b.time, "DD/MM/YYYY hh:mm A")
          )
            ? -1
            : 1
        );
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [date]);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.appointment_no.toString().includes(searchTerm) ||
      event.mobileno.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Appointments on {moment(date).format("MMMM Do, YYYY")}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#4caf50",
            color: "#fff",
            borderRadius: "50px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "50px",
            border: "1px solid #ddd",
            width: "300px",
          }}
        />
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>

      {currentEvents.length > 0 ? (
        <div>
          {currentEvents.map((event) => (
            <div
              key={event.appointment_no}
              style={{
                marginBottom: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#fff",
              }}
            >
              <h3>Name: {highlightText(event.name, searchTerm)}</h3>
              <p>
                <strong>Time:</strong> {highlightText(event.time, searchTerm)}
              </p>
              <p>
                <strong>Treatment:</strong>{" "}
                {highlightText(event.treatment, searchTerm)}
              </p>
              <p>
                <strong>Mobile No:</strong>{" "}
                {highlightText(event.mobileno, searchTerm)}
              </p>
              <p>
                <strong>Appointment No:</strong>{" "}
                {highlightText(event.appointment_no.toString(), searchTerm)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#888", fontSize: "18px" }}>
          No appointments for this day.
        </p>
      )}
    </div>
  );
};

export default EventDetailsPage;

// Code by Prajwal Punekar

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./navBar";
import axiosInstance from "./utils/interface";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/getallappointment",
          { withCredentials: true }
        );

        const formattedEvents = response.data.map((event) => {
          // Convert the stored date (if in non-ISO format) to a proper date object
          const parsedDate = moment(event.time, "DD/MM/YYYY hh:mm A").toDate();

          return {
            id: event.id,
            title: event.name,
            start: parsedDate,
            end: moment(parsedDate).add(1, "hours").toDate(),
            date: moment(parsedDate).format("YYYY-MM-DD"),
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [selectedMonth, selectedYear]);

  // Handlers
  const handleEventClick = (event) => {
    const date = moment(event.start).format("YYYY-MM-DD");
    navigate(`/events/${date}`);
  };

  const handleSelectSlot = (slotInfo) => {
    const date = moment(slotInfo.start).format("YYYY-MM-DD");
    navigate(`/events/${date}`);
  };

  // Event styling
  const eventPropGetter = () => ({
    style: {
      backgroundColor: "#4caf50",
      borderRadius: "8px",
      color: "white",
      border: "none",
      textAlign: "center",
      fontWeight: "500",
      fontSize: "12px",
      padding: "2px 4px",
    },
  });

  // Custom day event rendering
  const CustomDayEvent = ({ events }) => {
    const MAX_EVENTS_DISPLAY = 1;
    const hasMoreEvents = events.length > MAX_EVENTS_DISPLAY;

    return (
      <div>
        {events.slice(0, MAX_EVENTS_DISPLAY).map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            style={eventPropGetter(event).style}
          >
            {event.title}
          </div>
        ))}
        {hasMoreEvents && (
          <div
            onClick={() => {
              const date = moment(events[0].start).format("YYYY-MM-DD");
              navigate(`/events/${date}`);
            }}
            style={{
              ...eventPropGetter(events[0]).style,
              cursor: "pointer",
              marginTop: "5px",
            }}
          >
            +{events.length - MAX_EVENTS_DISPLAY} more
          </div>
        )}
      </div>
    );
  };

  // Group events by date for custom rendering
  const CustomDateCellWrapper = ({ children, value }) => {
    const date = moment(value).format("YYYY-MM-DD");
    const dayEvents = events.filter((event) => event.date === date);

    return (
      <div style={{ position: "relative", height: "100%" }}>
        {children}
        {dayEvents.length > 0 && (
          <div style={{ marginTop: "5px" }}>
            <CustomDayEvent events={dayEvents} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
      }}
    >
      {/* Header Controls */}
      <div class="main-wrapper">
        <Navbar />

        <div class="page-wrapper">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "10px 20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4caf50")}
            >
              Go Back
            </button>
            {/* <h2 style={{ margin: 0, color: "#4caf50" }}>📅 My Calendar</h2> */}
            <div style={{ display: "flex", gap: "15px" }}>
              <label>
                <strong>Month: </strong>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value);
                    setSelectedMonth(newMonth);
                    setCurrentDate(new Date(selectedYear, newMonth, 1));
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  {moment.months().map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <strong>Year: </strong>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    setSelectedYear(newYear);
                    setCurrentDate(new Date(newYear, selectedMonth, 1));
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - 2 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Calendar Component */}
          <div
            style={{
              marginTop: "10px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
              padding: "10px",
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              views={["month", "week", "day"]}
              style={{ height: "80vh", backgroundColor: "#fff" }}
              eventPropGetter={eventPropGetter}
              onSelectEvent={handleEventClick}
              onSelectSlot={handleSelectSlot}
              selectable
              components={{
                day: CustomDateCellWrapper,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;

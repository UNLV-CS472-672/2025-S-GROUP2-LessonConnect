import { useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // npm install react-calendar
import "../Styles/Booking.css";

const TUTOR_DATA = {
    // Mock availability: 'YYYY-MM-DD': [timeSlot, ...] Delete when back end is integrated
    availableSlots: {
        "2025-03-20": ["10:00 AM", "2:00 PM", "4:00 PM"],
        "2025-03-21": ["9:00 AM", "11:00 AM", "3:00 PM"],
        "2025-03-22": ["8:00 AM", "1:00 PM", "5:00 PM"],
    },
};

export default function Booking() {
    const { state } = useLocation(); // Retrieve tutor details passed from the previous page
    const tutor = state?.tutor;
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeOptions, setTimeOptions] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Convert Date to YYYY-MM-DD
    const formatDateKey = (date) => date.toISOString().split("T")[0];

    // Nicely formatted date
    const formatDisplayDate = (date) =>
        date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime("");
        setBookingConfirmed(false);

        const dateKey = formatDateKey(date);
        if (TUTOR_DATA.availableSlots[dateKey]) {  // replace with tutor?.availableSlots? when backend is integrated
            setTimeOptions(TUTOR_DATA.availableSlots[dateKey]); // replace with tutor?.availableSlots? when backend is integrated
        } else {
            setTimeOptions([]);
        }
    };

    const handleBook = () => {
        if (selectedDate && selectedTime) {
            setBookingConfirmed(true);
        }
    };

    return (
        <div className="booking-page-container">
            {/* ====== Details Title ====== */}
            <h2 className="section-title">Tutor Details</h2>

            {/* ====== Main Content: Left (Tutor) + Right (Suggestions) ====== */}
            <div className="main-content">
                {/* ====== Tutor Details Section ====== */}
                <section className="details-section">
                    <div className="details-header">
                        <div className="details-image-wrapper">
                            <img
                                src={tutor?.image_url || "/assets/images/default_tutor.png"}
                                alt={tutor?.first_name}
                                className="details-image"
                            />
                        </div>
                        <div className="details-info">
                            <h1>{tutor?.first_name} {tutor?.last_name}</h1>
                            {/* Add the rating badge here */}
                            {tutor?.rating && (
                                <div className="rating-badge-booking">
                                    <i className="bi bi-star-fill"></i>
                                    <span>{tutor.rating}</span>
                                </div>
                            )}
                            <p className="text-muted">{tutor.city}, {tutor.state}</p>
                            <div className="subjects-container">
                                {Array.isArray(tutor.subjects)
                                    ? tutor.subjects.map((subject, index) => (
                                        <span key={index} className="subject-tag">
                                            {subject}
                                        </span>
                                    ))
                                    : tutor.subjects?.split(',').map((subject, index) => (
                                        <span key={index} className="subject-tag">
                                            {subject.trim()}
                                        </span>
                                    ))}
                            </div>
                            <br/>
                            <button className="appointment-btn" onClick={() => setShowModal(true)}>
                                Book Appointment
                            </button>
                        </div>
                    </div>

                    {/* ====== About Me Section ====== */}
                    <section className="about-me-section">
                        <h2>About Me</h2>
                        <p>{tutor?.bio}</p>
                    </section>
                </section>
            </div>


            {/* ====== Modal for Calendar & Time Slots ====== */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {/* Close Modal (×) Button - absolute top right */}
                        <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                            ×
                        </button>

                        {/* If booking is confirmed, show confirmation instead of calendar/time slots */}
                        {!bookingConfirmed ? (
                            <>
                                <h2>Select a Date</h2>
                                <Calendar onChange={handleDateChange} value={selectedDate} />
                                {/* Time Slots */}
                                <div className="time-slot-section">
                                    <h3>Available Time Slots</h3>
                                    {selectedDate ? (
                                        timeOptions.length > 0 ? (
                                            <div className="time-slot-buttons">
                                                {timeOptions.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => {
                                                            setSelectedTime(time);
                                                        }}
                                                        className={`time-slot-btn ${
                                                            selectedTime === time ? "selected" : ""
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="no-slots">
                                                No available slots on {formatDisplayDate(selectedDate)}.
                                            </p>
                                        )
                                    ) : (
                                        <p className="no-slots">
                                            Please pick a date to see available times.
                                        </p>
                                    )}
                                </div>

                                <div className="confirm-btn-wrapper">
                                    <button
                                        className="confirm-btn"
                                        disabled={!selectedDate || !selectedTime}
                                        onClick={handleBook}
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="booking-confirmation">
                                <h3>Booking Confirmation</h3>
                                <p>
                                    <strong>Tutor:</strong> {tutor?.first_name} {tutor?.last_name}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {selectedDate ? formatDisplayDate(selectedDate) : ""}
                                </p>
                                <p>
                                    <strong>Time:</strong> {selectedTime}
                                </p>
                                <p>
                                    <em>(This is just a placeholder; no backend integration yet.)</em>
                                </p>
                                <button className="close-confirmation-btn" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

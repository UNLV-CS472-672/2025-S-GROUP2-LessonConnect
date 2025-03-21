import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // npm install react-calendar
import "../Styles/Booking.css";

const TUTOR_DATA = {
    id: 1,
    name: "Mr. Tom Cook",
    yearsOfExperience: 20,
    specialty: "Class Subjects Place Holder",
    location: "547 Carrington Trace Drive, Cornelius",
    aboutMe:
        "Hi! I'm a passionate coding tutor with a strong background in computer science and programming. I specialize in helping students and professionals grasp complex coding concepts, improve their problem-solving skills, and build real-world projects.\n" +
        "\n" +
        "With a Bachelor’s in Computer Science and currently pursuing my Master’s in Computer Science, I have a deep understanding of data structures, algorithms, AI, and cybersecurity. I also work as a researcher, which keeps me up-to-date with the latest advancements in technology.\n" +
        "\n" +
        "Whether you're a beginner looking to learn the basics or an advanced coder aiming to refine your skills, I provide clear explanations, hands-on exercises, and personalized guidance to help you succeed. My goal is to make coding fun, accessible, and rewarding for everyone.\n" +
        "\n" +
        "Let’s learn, code, and create together! ",
    profileImage: "assets/images/CodingTutor.png",
    socialLinks: {
        youtube: "https://youtube.com",
        linkedin: "https://www.linkedin.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
    },
    // Mock availability: 'YYYY-MM-DD': [timeSlot, ...]
    availableSlots: {
        "2025-03-20": ["10:00 AM", "2:00 PM", "4:00 PM"],
        "2025-03-21": ["9:00 AM", "11:00 AM", "3:00 PM"],
        "2025-03-22": ["8:00 AM", "1:00 PM", "5:00 PM"],
    },
};

// Example "Suggested Tutors"
const SUGGESTED_TUTORS = [
    {
        id: 2,
        name: "Ms. Jane Smith",
        specialty: "Software Engineer",
        profileImage: "assets/images/coding.jpg",
    },
    {
        id: 3,
        name: "Mr. Alex Johnson",
        specialty: "Full-Stack Developer",
        profileImage: "assets/images/coding.jpg",
    },
];

export default function Booking() {
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
        if (TUTOR_DATA.availableSlots[dateKey]) {
            setTimeOptions(TUTOR_DATA.availableSlots[dateKey]);
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
                                src={TUTOR_DATA.profileImage}
                                alt={TUTOR_DATA.name}
                                className="details-image"
                            />
                        </div>
                        <div className="details-info">
                            <h1>{TUTOR_DATA.name}</h1>
                            <p className="experience">
                                {TUTOR_DATA.yearsOfExperience} Years of Experience
                            </p>
                            <p className="location">{TUTOR_DATA.location}</p>
                            <span className="specialty-tag">{TUTOR_DATA.specialty}</span>
                            <div className="social-icons">
                                <a
                                    href={TUTOR_DATA.socialLinks.youtube}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="fab fa-youtube" />
                                </a>
                                <a
                                    href={TUTOR_DATA.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="fab fa-linkedin" />
                                </a>
                                <a
                                    href={TUTOR_DATA.socialLinks.twitter}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="fab fa-twitter" />
                                </a>
                                <a
                                    href={TUTOR_DATA.socialLinks.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="fab fa-facebook" />
                                </a>
                            </div>
                            <button
                                className="appointment-btn"
                                onClick={() => setShowModal(true)}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>

                    {/* ====== About Me Section ====== */}
                    <section className="about-me-section">
                        <h2>About Me</h2>
                        <p>{TUTOR_DATA.aboutMe}</p>
                    </section>
                </section>

                {/* ====== Suggestions Section ====== */}
                <aside className="suggestions-section">
                    <h3>Suggested Tutors</h3>
                    {SUGGESTED_TUTORS.map((tutor) => (
                        <div key={tutor.id} className="suggested-tutor-card">
                            <img
                                src={tutor.profileImage}
                                alt={tutor.name}
                                className="suggested-tutor-image"
                            />
                            <div className="suggested-tutor-info">
                                <p className="suggested-tutor-name">{tutor.name}</p>
                                <p className="suggested-tutor-specialty">{tutor.specialty}</p>
                            </div>
                        </div>
                    ))}
                </aside>
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
                                                No available slots on{" "}
                                                {formatDisplayDate(selectedDate)}.
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
                                    <strong>Tutor:</strong> {TUTOR_DATA.name}
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

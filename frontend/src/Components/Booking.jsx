import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // npm install react-calendar; npm install react-calendar
import "../Styles/Booking.css";

const TUTOR_DATA = {
    id: 1,
    name: "Mr. Tom Cook",
    yearsOfExperience: 20,
    specialty: "Computer Scientist",
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

export default function Booking() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeOptions, setTimeOptions] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    // Convert Date object to YYYY-MM-DD
    const formatDateKey = (date) => date.toISOString().split("T")[0];

    // Nicely formatted date for display
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
            {/* ====== Details Section (image + info) ====== */}
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
                            <a href={TUTOR_DATA.socialLinks.youtube} target="_blank" rel="noreferrer">
                                <i className="fab fa-youtube" />
                            </a>
                            <a href={TUTOR_DATA.socialLinks.linkedin} target="_blank" rel="noreferrer">
                                <i className="fab fa-linkedin" />
                            </a>
                            <a href={TUTOR_DATA.socialLinks.twitter} target="_blank" rel="noreferrer">
                                <i className="fab fa-twitter" />
                            </a>
                            <a href={TUTOR_DATA.socialLinks.facebook} target="_blank" rel="noreferrer">
                                <i className="fab fa-facebook" />
                            </a>
                        </div>
                        <button
                            className="appointment-btn"
                            onClick={() => {
                                // Scroll down to the booking calendar
                                document
                                    .getElementById("booking-calendar-section")
                                    .scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </section>

            {/* ====== About Me Section ====== */}
            <section className="about-me-section">
                <h2>About Me</h2>
                <p>{TUTOR_DATA.aboutMe}</p>
            </section>

            {/* ====== Booking Calendar Section ====== */}
            <section id="booking-calendar-section" className="calendar-section">
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
                                            setBookingConfirmed(false);
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
                        <p className="no-slots">Please pick a date to see available times.</p>
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

                {bookingConfirmed && (
                    <div className="booking-confirmation">
                        <h3>Booking Confirmation</h3>
                        <p>
                            <strong>Tutor:</strong> {TUTOR_DATA.name}
                        </p>
                        <p>
                            <strong>Date:</strong> {formatDisplayDate(selectedDate)}
                        </p>
                        <p>
                            <strong>Time:</strong> {selectedTime}
                        </p>
                        <p>
                            <em>(This is just a placeholder; no backend integration yet.)</em>
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

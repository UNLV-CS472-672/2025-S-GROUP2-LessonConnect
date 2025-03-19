import {Link, NavLink} from "react-router-dom";
import React, { useState } from "react";
import "../Styles/Booking.css";
// import Header from "./Header";
// import Footer from "./Footer";
// Import global and booking styles: (tbh idk for now, but will sort out later )
import "../Styles/./Home.css";
import "../Styles/./Booking.css";

// Optional placeholder images for tutors:
const TUTOR_IMAGES = {
    john: "assets/images/coding.jpg",
    jane: "assets/images/coding.jpg",
    alex: "assets/images/coding.jpg",
};

export default function Booking() {
    // Mock data for tutors and their available time slots
    const [tutors] = useState([
        {
            id: 1,
            name: "John Doe",
            imgKey: "john",
            availableSlots: [
                "2025-05-01T10:00",
                "2025-05-01T14:00",
                "2025-05-02T09:00",
                "2025-05-02T15:00",
            ],
        },
        {
            id: 2,
            name: "Jane Smith",
            imgKey: "jane",
            availableSlots: [
                "2025-05-03T11:00",
                "2025-05-03T16:00",
                "2025-05-04T10:00",
            ],
        },
        {
            id: 3,
            name: "Alex Johnson",
            imgKey: "alex",
            availableSlots: [
                "2025-06-01T09:00",
                "2025-06-01T13:00",
                "2025-06-02T10:00",
                "2025-06-02T14:00",
            ],
        },
    ]);

    // Local state for user selections
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const handleSelectTutor = (tutor) => {
        setSelectedTutor(tutor);
        setSelectedSlot("");
        setBookingConfirmed(false);
        // Scroll smoothly to the timeslot area
        document
            .getElementById("timeslot-section")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSlotChange = (e) => {
        setSelectedSlot(e.target.value);
        setBookingConfirmed(false);
    };

    const handleBook = () => {
        if (selectedTutor && selectedSlot) {
            setBookingConfirmed(true);
        }
    };

    return (
        <>
            {/* Global Header */}
            {/*<Header />*/}
            {/*JUst keeping it in mind so i dont forget lol */}

            {/* Main booking container */}
            <div className="booking-container">
                {/* Hero / page heading */}
                <div className="booking-hero">
                    <h1>Book Your Session</h1>
                    <p>Find the right tutor and schedule a time!</p>
                </div>

                {/* Tutors Section */}
                <section className="tutors-section">
                    <h2 className="section-title">1. Choose Your Tutor</h2>
                    <div className="tutors-grid">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="tutor-card"
                                onClick={() => handleSelectTutor(tutor)}
                            >
                                <div className="tutor-image">
                                    <img
                                        src={TUTOR_IMAGES[tutor.imgKey]}
                                        alt={tutor.name}
                                    />
                                </div>
                                <div className="tutor-info">
                                    <h3>{tutor.name}</h3>
                                    <button className="select-btn">Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Time Slots Section */}
                <section id="timeslot-section" className="timeslot-section">
                    <h2 className="section-title">2. Pick a Time Slot</h2>
                    {selectedTutor ? (
                        <>
                            <p className="selected-tutor">
                                You selected <strong>{selectedTutor.name}</strong>.
                            </p>
                            <select
                                className="timeslot-select"
                                value={selectedSlot}
                                onChange={handleSlotChange}
                            >
                                <option value="">-- Select a Time Slot --</option>
                                {selectedTutor.availableSlots.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                            <div className="timeslot-buttons">
                                <button
                                    className="booking-btn"
                                    disabled={!selectedSlot}
                                    onClick={handleBook}
                                >
                                    Book Now
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="no-tutor-warning">
                            Please select a tutor above to see available slots.
                        </p>
                    )}
                </section>

                {/* Confirmation Section */}
                {bookingConfirmed && (
                    <section className="booking-confirmation">
                        <h3>Booking Confirmation</h3>
                        <p>
                            <strong>Tutor:</strong> {selectedTutor.name}
                        </p>
                        <p>
                            <strong>Time Slot:</strong> {selectedSlot}
                        </p>
                        <p>
                            <em>(This is a placeholder. Backend integration comes later.)</em>
                        </p>
                    </section>
                )}
            </div>

            {/* Global Footer */}
            {/*<Footer />*/}
        </>
    );
}

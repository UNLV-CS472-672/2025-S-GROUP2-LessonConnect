import {Link, NavLink} from "react-router-dom";

import React, { useState } from "react";
import "../Styles/Booking.css";

export default function Booking() {
    // Mock data for tutors and their available time slots
    const [tutors] = useState([
        {
            id: 1,
            name: "John Doe",
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
            availableSlots: [
                "2025-05-03T11:00",
                "2025-05-03T16:00",
                "2025-05-04T10:00",
            ],
        },
        {
            id: 3,
            name: "Alex Johnson",
            availableSlots: [
                "2025-06-01T09:00",
                "2025-06-01T13:00",
                "2025-06-02T10:00",
                "2025-06-02T14:00",
            ],
        },
    ]);

    // Local state for user selections
    const [selectedTutor, setSelectedTutor] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    // Handle changes to the tutor dropdown
    const handleTutorChange = (e) => {
        setSelectedTutor(e.target.value);
        setSelectedSlot("");
        setBookingConfirmed(false);
    };

    // Handle changes to the time slot dropdown
    const handleSlotChange = (e) => {
        setSelectedSlot(e.target.value);
        setBookingConfirmed(false);
    };

    // Handle the booking confirmation
    const handleBook = () => {
        if (selectedTutor && selectedSlot) {
            setBookingConfirmed(true);
        }
    };

    // Find the currently selected tutor so we can display the right slots
    const currentTutor = tutors.find((tutor) => tutor.name === selectedTutor);
    const availableSlots = currentTutor ? currentTutor.availableSlots : [];

    return (
        <div className="booking-container">
            <h2 className="booking-title">Book a Session</h2>

            {/* Tutor Selection */}
            <div className="booking-section">
                <label htmlFor="tutorSelect">Choose a Tutor:</label>
                <select
                    id="tutorSelect"
                    value={selectedTutor}
                    onChange={handleTutorChange}
                >
                    <option value="">-- Select a Tutor --</option>
                    {tutors.map((tutor) => (
                        <option key={tutor.id} value={tutor.name}>
                            {tutor.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date/Time Picker (slot selection) */}
            <div className="booking-section">
                <label htmlFor="slotSelect">Available Slots:</label>
                <select
                    id="slotSelect"
                    value={selectedSlot}
                    onChange={handleSlotChange}
                    disabled={!selectedTutor}
                >
                    <option value="">-- Select a Time Slot --</option>
                    {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
            </div>

            {/* Booking Button */}
            <button
                className="booking-btn"
                onClick={handleBook}
                disabled={!selectedTutor || !selectedSlot}
            >
                Book Now
            </button>

            {/* Placeholder Booking Confirmation Section */}
            {bookingConfirmed && (
                <div className="booking-confirmation">
                    <h3>Booking Confirmation</h3>
                    <p>
                        <strong>Tutor:</strong> {selectedTutor}
                    </p>
                    <p>
                        <strong>Time Slot:</strong> {selectedSlot}
                    </p>
                    <p>(This is a placeholder confirmation. No backend integration yet.)</p>
                </div>
            )}
        </div>
    );
}

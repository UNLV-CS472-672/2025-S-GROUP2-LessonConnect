import React, { useState } from "react";
import Calendar from "react-calendar";
import '../Styles/Calendar.css'
import { FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";

// okay we need a helper functioon that is for sure
// Helper function: get the start (Sunday) of the week for a given date
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // Sunday = 0, Monday = 1, etc.
    d.setDate(d.getDate() - day);
    return d;
};
function LessonCalendar() {
    // ---------------------------
    // STATES & SAMPLE DATA
    // ---------------------------
    const [value, setValue] = useState(new Date()); // Currently selected date
    const [view, setView] = useState("month"); // "month" or "week"
    const [searchQuery, setSearchQuery] = useState(""); // For event search (UC6)
    const [showProgress, setShowProgress] = useState(true); // Toggle progress tracker display
// Sample unscheduled tasks (UC8)
    const [unscheduledTasks, setUnscheduledTasks] = useState([
        { id: 1, title: "Math Tutoring (Draft)", type: "Lesson" },
        { id: 2, title: "Reading Club Prep", type: "Meeting" },
        { id: 3, title: "Coding Practice Session", type: "Practice" },
    ]);

    // Sample events to display on the calendar
    const [events, setEvents] = useState([
        { date: new Date(), title: "Math Tutoring w/ Mr. Smith" },
        { date: new Date(Date.now() + 86400000), title: "Biology Lab" },
        { date: new Date(Date.now() + 2 * 86400000), title: "History Discussion" },
    ]);

    // Filter events based on search query (UC6)
    const filteredEvents = events.filter((ev) =>
        ev.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // For week view: calculate dates for the current week
    const startOfWeek = getStartOfWeek(value);
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        return d;
    });

    // ---------------------------
    // EVENT HANDLERS & FUNCTIONS
    // ---------------------------
    // Handler when a date is selected/changed on the calendar (for month view)
    const onDateChange = (newDate) => {
        setValue(newDate);
    };

    // Handler for the Auto-Schedule button (UC5)
    const handleAutoSchedule = () => {
        // TODO: Integrate backend API call for auto-scheduling algorithm.
        console.log("Auto-scheduling lessons based on availability...");
        alert("Auto-scheduling triggered! (Integrate backend API)");
    };

    // Handler for creating a new event/reminder (UC3)
    const handleCreateEvent = () => {
        // TODO: Open a modal with a form for event creation and call backend API on submission.
        alert("Open event creation modal! (Integrate with backend)");
    };

    // Handler for resetting the calendar to today's date
    const handleToday = () => {
        setValue(new Date());
    };

    // Handlers for navigating through the calendar (UC11)
    const handlePrev = () => {
        const tempDate = new Date(value);
        if (view === "month") {
            tempDate.setMonth(tempDate.getMonth() - 1);
        } else {
            // For week view: subtract 7 days
            tempDate.setDate(tempDate.getDate() - 7);
        }
        setValue(tempDate);
    };

    const handleNext = () => {
        const tempDate = new Date(value);
        if (view === "month") {
            tempDate.setMonth(tempDate.getMonth() + 1);
        } else {
            // For week view: add 7 days
            tempDate.setDate(tempDate.getDate() + 7);
        }
        setValue(tempDate);
    };

    // Render event markers on calendar tiles for month view
    const tileContent = ({ date }) => {
        const dayEvents = (searchQuery ? filteredEvents : events).filter(
            (ev) => ev.date.toDateString() === date.toDateString()
        );
        return (
            <div className="tile-events">
                {dayEvents.map((ev, index) => (
                    <div key={index} className="calendar-event-marker">
                        {ev.title}
                    </div>
                ))}
            </div>
        );
    };
    <>
        {/*will add code here later */}
    </>
}
export default LessonCalendar;

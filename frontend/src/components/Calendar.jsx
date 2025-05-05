import { useState } from "react"; // no need for import react
import Calendar from "react-calendar";
import "../Styles/Calendar.css";
import { FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
    const [unscheduledTasks] = useState([
        { id: 1, title: "Math Tutoring (Draft)", type: "Lesson" },
        { id: 2, title: "Reading Club Prep", type: "Meeting" },
        { id: 3, title: "Coding Practice Session", type: "Practice" },
    ]);

    // Sample events to display on the calendar
    const [events] = useState([
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

    // Handler for the Auto-StudentView button (UC5)
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

    // ---------------------------
    // COMPONENT RENDER
    // ---------------------------
    return (
        <div className="calendar-page">
            <div className="calendar-body">
                {/* LEFT PANEL: Calendar display & Weekly Progress Tracker */}
                <div className="left-panel">
                    {/* Section: Month/Week toggle, "Today", and event creation buttons */}
                    <div className="month-header">
                        <div className="view-toggle">
                            <button
                                className={view === "week" ? "active" : ""}
                                onClick={() => setView("week")}
                            >
                                Week
                            </button>
                            <button
                                className={view === "month" ? "active" : ""}
                                onClick={() => setView("month")}
                            >
                                Month
                            </button>
                        </div>
                        <div className="month-title">
                            {value.toLocaleString("default", { month: "long" })}{" "}
                            {value.getFullYear()}
                        </div>
                        <div className="header-actions">
                            <button className="today-btn" onClick={handleToday}>
                                Today
                            </button>
                            <button className="create-event-btn" onClick={handleCreateEvent}>
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                    {/* Calendar or Custom Week View (UC11) */}
                    <div className="calendar-wrapper">
                        <button className="nav-arrow" onClick={handlePrev}>
                            <FaArrowLeft />
                        </button>
                        {view === "month" ? (
                            <Calendar
                                onChange={onDateChange}
                                value={value}
                                view="month"
                                tileContent={tileContent}
                            />
                        ) : (
                            <div className="week-view">
                                {weekDates.map((date, i) => (
                                    <div className="week-day" key={i}>
                                        <div className="week-day-header">
                                            {date.toLocaleDateString("default", {
                                                weekday: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                        <div className="week-day-events">
                                            {(searchQuery ? filteredEvents : events)
                                                .filter(
                                                    (ev) =>
                                                        ev.date.toDateString() === date.toDateString()
                                                )
                                                .map((ev, index) => (
                                                    <div key={index} className="calendar-event-marker">
                                                        {ev.title}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="nav-arrow" onClick={handleNext}>
                            <FaArrowRight />
                        </button>
                    </div>

                    {/* Weekly Progress Tracker (UC10) */}
                    <div className="progress-section">
                        <label className="toggle-progress">
                            <span>Progress</span>
                            <input
                                type="checkbox"
                                checked={showProgress}
                                onChange={() => setShowProgress(!showProgress)}
                            />
                        </label>
                        {showProgress && (
                            <div className="progress-bars">
                                <div className="progress-item">
                                    <span>Math:</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: "25%" /* TODO: Replace with dynamic value from backend */,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="progress-percent">25%</span>
                                </div>
                                <div className="progress-item">
                                    <span>Biology:</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: "74%" /* TODO: Replace with dynamic value from backend */,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="progress-percent">74%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Auto-StudentView, Search/Filter, Unscheduled Tasks, File Attachment */}
                <div className="right-panel">
                    <button className="auto-sched-btn" onClick={handleAutoSchedule}>
                        AUTO Schedule
                    </button>
                    <div className="search-section">
                        <div className="search-input-wrapper">
                            <input
                                className="search-bar"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="clear-search"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="filter-section">
                            <h4>Filter</h4>
                            <ul>
                                <li onClick={() => alert("Filter by teacher! (Integrate backend)")}>
                                    by Teacher
                                </li>
                                <li onClick={() => alert("Filter by subject! (Integrate backend)")}>
                                    by Subject
                                </li>
                                <li onClick={() => alert("Filter by skill level! (Integrate backend)")}>
                                    by Skill Level
                                </li>
                                <li onClick={() => alert("Filter by event! (Integrate backend)")}>
                                    by Event
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="unscheduled-tasks">
                        <h4>Unscheduled Tasks</h4>
                        <ul>
                            {unscheduledTasks.map((task) => (
                                <li key={task.id}>
                                    <span className="task-type">[{task.type}]</span> {task.title}
                                    {/* TODO: Add drag-and-drop functionality and integrate backend update */}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        className="file-attach-btn"
                        onClick={() =>
                            alert("Open file upload dialog! (Integrate backend file upload)")
                        }
                    >
                        File attach
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LessonCalendar;

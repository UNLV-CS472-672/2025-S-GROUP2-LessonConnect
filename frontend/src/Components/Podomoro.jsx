// import {NavLink} from "react-router-dom"; // Uncomment if you are going use it (Ashley helped by Frank)
import { useState, useEffect, useRef } from "react";
import "../Styles/Pomodoro.css"; // 1) Import your dedicated CSS file

export default function Pomodoro() {
    // --------------------- STATE & REFS ---------------------
    const WORK_MINUTES = 25;
    const SHORT_BREAK_MINUTES = 5;
    const LONG_BREAK_MINUTES = 15;

    const [totalTime, setTotalTime] = useState(WORK_MINUTES * 60); // total time in seconds
    const [remainingTime, setRemainingTime] = useState(totalTime);
    const [isRunning, setIsRunning] = useState(false);
    const [activeSession, setActiveSession] = useState("work"); // "work" | "shortBreak" | "longBreak"

    // Store the setInterval ID so we can clear it
    const intervalRef = useRef(null);

    // Circle reference for the progress ring
    const circleRef = useRef(null);

    // --------------------- EFFECTS ---------------------
    // On mount, set the circle’s strokeDasharray
    useEffect(() => {
        const circle = circleRef.current;
        if (!circle) return;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
    }, []);

    // Whenever remainingTime or totalTime changes, update strokeDashoffset
    useEffect(() => {
        const circle = circleRef.current;
        if (!circle) return;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const percent = remainingTime / totalTime;
        const offset = circumference - percent * circumference;
        circle.style.strokeDashoffset = offset;
    }, [remainingTime, totalTime]);

    // --------------------- HELPER FUNCTIONS ---------------------
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

    // --------------------- TIMER CONTROLS ----------------------
    function startTimer() {
        if (isRunning) return;
        setIsRunning(true);

        intervalRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    alert("Time is up!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }

    function pauseTimer() {
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }

    function resetTimer() {
        pauseTimer();
        setRemainingTime(totalTime);
    }

    function setSession(minutes, sessionName) {
        pauseTimer();
        setTotalTime(minutes * 60);
        setRemainingTime(minutes * 60);
        setActiveSession(sessionName);
    }

    // Assign "active" class on the selected session
    function sessionBtnClass(sessionName) {
        return "session-btn" + (activeSession === sessionName ? " active" : "");
    }

    // Format remaining time for display
    const timeDisplay = formatTime(remainingTime);

    // --------------------- RENDER ---------------------
    return (
        <div className="pomodoro-page">
            <header>
                <h1>LessonConnect Pomodoro Timer</h1>
            </header>

            <main>
                {/* Timer Display + Circle Progress */}
                <div className="timer-container">
                    <svg className="progress-ring" width="280" height="280">
                        {/* Circle background */}
                        <circle
                            className="progress-ring__background"
                            stroke="#ccc"
                            strokeWidth="12"
                            fill="transparent"
                            r="125"
                            cx="140"
                            cy="140"
                        />
                        {/* Circle progress */}
                        <circle
                            ref={circleRef}
                            className="progress-ring__circle"
                            stroke="#FF6B6B"
                            strokeWidth="12"
                            fill="transparent"
                            r="125"
                            cx="140"
                            cy="140"
                        />
                    </svg>
                    <div className="time-display" id="time-display">
                        {timeDisplay}
                    </div>
                </div>

                {/* Controls */}
                <div className="controls">
                    <button onClick={startTimer} className="btn primary" id="start-btn">
                        Start
                    </button>
                    <button onClick={pauseTimer} className="btn" id="pause-btn">
                        Pause
                    </button>
                    <button onClick={resetTimer} className="btn" id="reset-btn">
                        Reset
                    </button>
                </div>

                {/* Session Toggle */}
                <div className="session-controls">
                    <button
                        onClick={() => setSession(WORK_MINUTES, "work")}
                        className={sessionBtnClass("work")}
                        id="work-session"
                    >
                        Work 25
                    </button>
                    <button
                        onClick={() => setSession(SHORT_BREAK_MINUTES, "shortBreak")}
                        className={sessionBtnClass("shortBreak")}
                        id="short-break"
                    >
                        Break 5
                    </button>
                    <button
                        onClick={() => setSession(LONG_BREAK_MINUTES, "longBreak")}
                        className={sessionBtnClass("longBreak")}
                        id="long-break"
                    >
                        Break 15
                    </button>
                </div>
                <section className="info-section">
                    <h2>What is the Pomodoro Technique?</h2>
                    <p>
                        The Pomodoro Technique is a time management method that breaks work into intervals,
                        typically 25 minutes of focused work followed by a 5-minute break. This improves productivity
                        and reduces burnout.
                    </p>

                    <h3>How to Use This Timer</h3>
                    <ul>
                        <li>Click <strong>Start</strong> to begin your 25-minute session.</li>
                        <li>Take a short break when the timer ends.</li>
                        <li>Repeat for 4 cycles, then take a longer break.</li>
                    </ul>
                </section>
            </main>

            <footer>
                <p>Powered by LessonConnect</p>
            </footer>
        </div>
    );
}

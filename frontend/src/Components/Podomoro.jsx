import {NavLink} from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
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
        <>
            {/*Add your code below this line*/}
        </>
    );
}

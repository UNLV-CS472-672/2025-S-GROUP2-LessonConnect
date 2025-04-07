import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";


export default function StudentLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);


    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };


    return (
        <div className={`student-layout ${isDarkMode ? "dark-mode" : ""}`}>
            <StudentNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <div className="student-content">
                {children}
            </div>
        </div>
    );
}

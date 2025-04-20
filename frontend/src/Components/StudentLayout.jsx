import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import PropTypes from "prop-types";

export default function StudentLayout({ children }) {
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Dynamically determine role based on URL
    const role = location.pathname.startsWith("/tutor") ? "tutor" : "student";
    console.log("Navbar role is:", role);

    // Inject darkMode into child components
    const childrenWithProps = React.Children.map(children, child =>
        React.isValidElement(child)
            ? React.cloneElement(child, { darkMode: isDarkMode, toggleTheme })
            : child
    );

    return (
        <div className={`student-layout ${isDarkMode ? "dark-mode" : ""}`}>
            <StudentNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} role={role} />
            <div className="student-content">
                {childrenWithProps}
            </div>
        </div>
    );
}

StudentLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

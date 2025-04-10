import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";
import PropTypes from "prop-types";


export default function StudentLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Inject darkMode into child components
    const childrenWithProps = React.Children.map(children, child =>
        React.isValidElement(child)
            ? React.cloneElement(child, { darkMode: isDarkMode, toggleTheme })
            : child
    );

    return (
        <div className={`student-layout ${isDarkMode ? "dark-mode" : ""}`}>
            <StudentNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <div className="student-content">
                {childrenWithProps}
            </div>
        </div>
    );
}

StudentLayout.propTypes = {
    children: PropTypes.node.isRequired,
};


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Learn_more from "./components/Learn_more";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import React from "react";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} /> {/* Fixed route path */}
                <Route path="/learn_more" element={<Learn_more />} />
                {/* 2. Login page (path="/login") */}
                <Route path="/login" element={<Login />} />

                {/* 3. Sign up page (path="/signup") */}
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;

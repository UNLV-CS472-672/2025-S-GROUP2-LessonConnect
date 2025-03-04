import {Routes, Route } from "react-router-dom";
import "./Styles/index.css";
import Home from "./components/Home";
import About from "./components/About";
import Learn_more from "./components/Learn_more";
import SignUp from "./Components/SignUp.jsx";
import Login from "./Components/Login.jsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} /> {/* Fixed route path */}
                <Route path="/learn_more" element={<Learn_more />} />
                {/* 2. Login page (path="/login") */}
                <Route path="/login" element={<Login />} />
                {/* 3. Sign up page (path="/signup") */}
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </div>
    );
}

export default App;
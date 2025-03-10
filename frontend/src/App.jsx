import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Components/Header.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Learn_more from "./components/Learn_more.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import DateOfBirth from "./Components/DateOfBirth.jsx";

function App() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); 
    }, [location]);

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/learn_more" element={<Learn_more />} />
                <Route path="/login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/dateofbirth" element={<DateOfBirth />} />
            </Routes>
        </div>
    );
}

export default App;

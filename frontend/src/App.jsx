import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Components/Header.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Learn_more from "./components/Learn_more.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import DateOfBirth from "./Components/DateOfBirth.jsx";
import Contact from "./Components/Contact.jsx";
import FAQS from "./Components/FAQS.jsx";
import Services from "./Components/Services.jsx";
import Support from "./Components/Support.jsx";
import FindTutor from "./Components/FindTutor.jsx";
import Pomodoro from "./Components/Podomoro.jsx";
import Schedule from "./Components/Schedule.jsx";
import Footer from "./Components/Footer.jsx";

function App() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="App">
            {(location.pathname !== "/login" && location.pathname !== "/dateofbirth" && location.pathname !== "/SignUp") && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/learn_more" element={<Learn_more />} />
                <Route path="/login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/dateofbirth" element={<DateOfBirth />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/faqs" element={<FAQS />} />
                <Route path="/findTutor" element={<FindTutor />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
            </Routes>
            {(location.pathname !== "/login" && location.pathname !== "/dateofbirth" && location.pathname !== "/SignUp") && <Footer />}
        </div>
    );
}

export default App;

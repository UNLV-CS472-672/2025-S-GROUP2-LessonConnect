import {Routes, Route } from "react-router-dom";
import "./Styles/index.css";
import Home from "./components/Home";
import About from "./components/About";
import Learn_more from "./components/Learn_more";
import SignUp from "./Components/SignUp.jsx";
import Login from "./Components/Login.jsx";
import DateOfBirth from "./Components/DateOfBirth.jsx";
import Contact from "./Components/Contact.jsx";
import FAQS from "./Components/FAQS.jsx";
import Services from "./Components/Services.jsx";
import Support from "./Components/Support.jsx";
import FindTutor from "./Components/FindTutor.jsx";
import Pomodoro from "./Components/Podomoro.jsx";
import Footer from "./Components/Footer.jsx";

function App() {
    return (
        <div className="App">
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
                <Route path="/pomodoro" element={<Pomodoro />} />
            </Routes>
        </div>
    );
}

export default App;
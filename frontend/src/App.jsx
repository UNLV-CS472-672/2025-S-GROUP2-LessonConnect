import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import StudentLayout from "./Components/StudentLayout.jsx";

// Components
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
import StudentView from "./Components/StudentView.jsx";
import Chat from "./Components/Chat.jsx";
import Booking from "./Components/Booking.jsx";
import VideoCall from "./Components/VideoCall.jsx";
import Calendar from "./Components/Calendar.jsx";

function App() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="App">
            {(location.pathname !== "/login" && location.pathname !== "/dateofbirth" && location.pathname !== "/SignUp" &&
                location.pathname !== "/StudentView" && location.pathname !== "/calendar" &&
                location.pathname !== "/chat" && location.pathname !== "/videocall") && <Header />}

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/learn_more" element={<Learn_more />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/dateofbirth" element={<DateOfBirth />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/faqs" element={<FAQS />} />
                <Route path="/findTutor" element={<FindTutor />} />

                {/* Student Routes with Layout */}
                <Route path="/StudentView" element={<StudentLayout><StudentView /></StudentLayout>} />
                <Route path="/student/calendar" element={<StudentLayout><Calendar /></StudentLayout>} />
                <Route path="/student/chat" element={<StudentLayout><Chat /></StudentLayout>} />
                <Route path="/student/videocall" element={<StudentLayout><VideoCall /></StudentLayout>} />
                <Route path="/student/booking" element={<StudentLayout><Booking /></StudentLayout>} />
                <Route path="/student/pomodoro" element={<StudentLayout><Pomodoro /></StudentLayout>} />
                <Route path="/student/findTutor" element={<StudentLayout><FindTutor /></StudentLayout>} />
                <Route path="/student/support" element={<StudentLayout><Support /></StudentLayout>} />
                <Route path="/student/contact" element={<StudentLayout><Contact /></StudentLayout>} />
                <Route path="/student/services" element={<StudentLayout><Services /></StudentLayout>} />
                <Route path="/student/faqs" element={<StudentLayout><FAQS /></StudentLayout>} />
                <Route path="/student/learn_more" element={<StudentLayout><Learn_more /></StudentLayout>} />
                <Route path="/student/about" element={<StudentLayout><About /></StudentLayout>} />
                {/*<Route path="/student/settings" element={<StudentLayout><Settings /></StudentLayout>} />*/}
                {/*<Route path="/student/lessons" element={<StudentLayout><Lessons /></StudentLayout>} />*/}
                {/*<Route path="/student/resources" element={<StudentLayout><Resources /></StudentLayout>} />*/}
            </Routes>
            {(location.pathname !== "/login" && location.pathname !== "/dateofbirth" && location.pathname !== "/SignUp") && <Footer />}
        </div>
    );
}

export default App;

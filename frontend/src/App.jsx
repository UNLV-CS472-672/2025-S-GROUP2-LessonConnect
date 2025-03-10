import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Home from "./components/Home";
import About from "./components/About";
import Learn_more from "./components/Learn_more";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import DateOfBirth from "./Components/DateOfBirth.jsx";

function App() {
    const location = useLocation();
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
            </Routes>
        </div>
    );
}

export default App;

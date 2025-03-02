import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Learn_more from "./components/Learn_more";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} /> {/* Fixed route path */}
                <Route path="/learn_more" element={<Learn_more />} />
            </Routes>
        </Router>
    );
}

export default App;

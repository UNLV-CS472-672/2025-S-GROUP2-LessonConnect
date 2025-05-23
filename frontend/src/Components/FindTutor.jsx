import { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import axios from "axios";
import { NavLink } from "react-router-dom";
import FilterDropdown from "./FilterDropdown";
import "../Styles/FindTutor.css";
export default function FindTutor({ darkMode }) {
    // State variables for search input, filter options, and results
    const [what, setWhat] = useState(""); // To store the subject or tutor name
    const [where, setWhere] = useState(""); // To store the location
    const [tutorList, setTutorList] = useState([]); // To store fetched tutors
    const [loading, setLoading] = useState(false); // To track loading state
    const [, setError] = useState(""); // To store any error message

    // Filter states for subject types, price range, and rating
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(150);
    const [selectedRating, setSelectedRating] = useState(null);

    // Handle search logic and API call
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!what || !where) {
            alert("Please fill in both search fields.");
            return;
        }
        setLoading(true); // Set loading to true when starting the API call
        setError(""); // Clear any previous error messages

        try {
            // Making the API call with search parameters
            const response = await axios.get("http://127.0.0.1:8000/search/", {
                params: {
                    what, // Subject or tutor name
                    where, // Location
                    rating: selectedRating || "", // Rating filter
                    "min-price": minPrice || "", // Minimum price filter
                    "max-price": maxPrice || "", // Maximum price filter
                    subjects: selectedTypes.join(",") || "", // Subject filter (multiple subjects can be selected)
                },
            });

            // Set the fetched tutors to state
            setTutorList(response.data.data);
        } catch (err) {
            // Catch and display errors
            setError("Error fetching tutors: " + err.message);
        } finally {
            setLoading(false); // Reset loading state after request
        }
    };

    const location = useLocation();
    const isStudentRoute = location.pathname.includes("/student");

    return (

        <div className={`findTutor-section ${darkMode ? "dark-mode" : ""}`}>
            {/* Header Section */}
            <div className="container py-8">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <div className="max-w-lg">
                            <h2 className="h2 fw-semibold text-dark">
                                Find & Book <span className="text-primary">Appointment</span> with your Favorite <span className="text-primary">Tutors</span>
                            </h2>
                            <p className="mt-4 text-muted">
                                Our platform connects you with experienced educators who specialize in various subjects. Whether you&apos;re looking for academic support, music lessons, or skill-building sessions, we make it easy to find and book a tutor that fits your schedule. Start your learning journey today.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <img
                            src="/assets/images/Pic4.jpg"
                            className="img-fluid"
                            alt="Image"
                        />
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="container mt-4 text-center mb-4">
                <h2 className="fw-bold display-6">
                    Search <span className="text-primary">Tutors</span>
                </h2>
                <h2 className="text-secondary fs-4">Find your tutor and book a session in one click!</h2>

                {/* Search Input Fields */}
                <div className="d-flex justify-content-center mt-3">
                    <div className="search-container d-flex rounded-pill border p-2">
                        <i className="bi bi-search text-muted fs-5 ms-2"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Enter category or tutor name"
                            value={what}
                            onChange={(e) => setWhat(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                        />
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Enter location"
                            value={where}
                            onChange={(e) => setWhere(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                        />
                        <button type="submit" className="btn btn-primary rounded-pill ms-2" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Dropdown Component */}
            <FilterDropdown
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
            />

            {/* Tutors List Section */}
            <div className="container mt-5">
                <h2 className="fw-bold fs-3 mt-5 mb-5 text-center">Popular Tutors</h2>
                {!loading && tutorList.length === 0 && (
                    <p className="text-center text-muted border-top pt-3">
                        Your search will appear here
                    </p>
                )}

                {/* Tutors Cards */}
                <div className="row mt-4">
                    {tutorList.map((tutor, index) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-5" key={index}>
                            <div className="tutor-card">
                                <div className="card-img-wrapper">
                                    <img src={tutor.image_url} alt="Tutor Image" className="card-img-top" />
                                    <div className="subject-badges">
                                        {Array.isArray(tutor.subjects)
                                            ? tutor.subjects.map((subject, idx) => (
                                                <span key={idx} className="badge-subject">{subject}</span>
                                            )) : tutor.subjects?.split(",").map((subject, idx) => (
                                                <span key={idx} className="badge-subject">{subject.trim()}</span>))}
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="fw-bold">{tutor.first_name} {tutor.last_name}</h5>
                                    <p className="fw-semibold">{tutor.experience}</p>
                                    <p className="text-muted">{tutor.city}, {tutor.state}</p>
                                    <p className="text-muted">Hourly Rate: ${tutor.hourly_rate}</p>
                                </div>
                                {/* Add the rating badge here */}
                                {tutor.rating && (
                                    <div className="rating-badge">
                                        <i className="bi bi-star-fill"></i>
                                        <span>{tutor.rating}</span>
                                    </div>
                                )}
                                <NavLink
                                    to={isStudentRoute ? "/student/booking" : "/booking"}
                                    state={{ tutor }}
                                    className="btn btn-outline-light book-btn"
                                >
                                    Book Now
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

FindTutor.propTypes = {
    darkMode: PropTypes.bool.isRequired,
};
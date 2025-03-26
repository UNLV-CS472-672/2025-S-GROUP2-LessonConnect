import "../Styles/filterDropdown.css";
import { useState } from "react";
const FilterDropdown = () => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(150);
    const [selectedRating, setSelectedRating] = useState(null);

    const toggleType = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };
    return (
        <div className="filter-dropdown-option">
            <div className="container mt-4">
                <div className="row">
                    <div id="filter-container" className="d-flex justify-content-center gap-3">
                        {/* Course Subjects Button */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Course Subjects
                            </button>
                            <ul className="dropdown-menu">
                                {["Mathematics", "Philosophy","Science", "Chemistry", "Writing", "Coding", "History", "Languages"].map((type) => (
                                    <li key={type}>
                                        <a className="dropdown-item" onClick={() => toggleType(type)}>
                                            <i className={selectedTypes.includes(type) ? "bi bi-check-square-fill" : "bi bi-square"}></i>
                                            <span className="ms-2">{type}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Min Price Button */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Min
                            </button>
                            <ul className="dropdown-menu p-3">
                                <label className="form-label">Minimum Price</label>
                                <output className="d-block text-end">${minPrice}</output>
                                <input type="range" className="form-range" min="0" max="150" value={minPrice}
                                       onChange={(e) => setMinPrice(e.target.value)} />
                            </ul>
                        </div>


                        {/* Max Price Button */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Max
                            </button>
                            <ul className="dropdown-menu p-3">
                                <label className="form-label">Maximum Price</label>
                                <output className="d-block text-end">${maxPrice}</output>
                                <input type="range" className="form-range" min="0" max="150" value={maxPrice}
                                       onChange={(e) => setMaxPrice(e.target.value)} />
                            </ul>
                        </div>


                        {/* Rate Button */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Rate
                            </button>
                            <ul className="dropdown-menu">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <li key={rating}>
                                        <a className="dropdown-item" onClick={() => setSelectedRating(rating)}>
                                            <i className={selectedRating === rating ? "bi bi-star-fill" : "bi bi-star"}></i>
                                            <span className="ms-2">{rating} Star{rating > 1 ? "s" : ""}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
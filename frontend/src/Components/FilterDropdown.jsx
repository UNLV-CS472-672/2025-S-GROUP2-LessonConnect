import "../Styles/filterDropdown.css";
import { useState } from "react";
const FilterDropdown = () => {
    const [selectedTypes, setSelectedTypes] = useState([]);

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
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Min Price
                        </button>

                        {/* Max Price Button */}
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Max Price
                        </button>

                        {/* Rate Button */}
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Rate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
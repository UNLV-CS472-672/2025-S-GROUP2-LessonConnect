import "../Styles/filterDropdown.css";
import { useState } from "react";

const FilterDropdown = ({
                            selectedTypes, setSelectedTypes,
                            minPrice, setMinPrice,
                            maxPrice, setMaxPrice,
                            selectedRating, setSelectedRating
                        }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    // Toggles the selection of a course subject
    const toggleType = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    // Handles opening and closing of dropdowns
    const handleDropdownClick = (dropdown) => {
        setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    // Handles blur event with delay to allow dropdown to remain open in Chrome
    const handleDropdownBlur = (e, dropdown) => {
        setTimeout(() => {
            // Close the dropdown only if the next focused element is outside the dropdown
            if (!e.currentTarget.contains(e.relatedTarget)) {
                setOpenDropdown(null);
            }
        }, 200);
    };

    return (
        <div className="filter-dropdown-option">
            <div className="container mt-4">
                <div className="row">
                    <div id="filter-container" className="d-flex justify-content-center gap-3">
                        <div className="dropdown" tabIndex={0} onBlur={(e) => handleDropdownBlur(e, "subjects")}>
                            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => handleDropdownClick("subjects")}>
                                Course Subjects
                            </button>
                            {openDropdown === "subjects" && (
                                <ul className="dropdown-menu show">
                                    {["Calculus I", "Calculus II", "Geometry", "Algebra", "Trigonometry", "Coding I", "Coding II", "Spanish I", "Spanish II", "ESL", "French", "World History", "Philosophy", "Physics"].map((type) => (
                                        <li key={type}>
                                            <a className="dropdown-item" onClick={() => toggleType(type)}>
                                                <i className={selectedTypes.includes(type) ? "bi bi-check-square-fill" : "bi bi-square"}></i>
                                                <span className="ms-2">{type}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Min Price Button */}
                        <div className="dropdown" tabIndex={0} onBlur={(e) => handleDropdownBlur(e, "minPrice")}>
                            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => handleDropdownClick("minPrice")}>
                                Min
                            </button>
                            {openDropdown === "minPrice" && (
                                <ul className="dropdown-menu show p-3">
                                    <label className="form-label">Minimum Price</label>
                                    <output className="d-block text-end">${minPrice}</output>
                                    <input type="range" className="form-range" min="0" max="150" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))}/>
                                </ul>
                            )}
                        </div>

                        {/* Max Price Button */}
                        <div className="dropdown" tabIndex={0} onBlur={(e) => handleDropdownBlur(e, "maxPrice")}>
                            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => handleDropdownClick("maxPrice")}>
                                Max
                            </button>
                            {openDropdown === "maxPrice" && (
                                <ul className="dropdown-menu show p-3">
                                    <label className="form-label">Maximum Price</label>
                                    <output className="d-block text-end">${maxPrice}</output>
                                    <input type="range" className="form-range" min="0" max="150" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/>
                                </ul>
                            )}
                        </div>

                        {/* Rating Dropdown */}
                        <div className="dropdown" tabIndex={0} onBlur={(e) => handleDropdownBlur(e, "rating")}>
                            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => handleDropdownClick("rating")}>
                                Rate
                            </button>
                            {openDropdown === "rating" && (
                                <ul className="dropdown-menu show">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <li key={rating}>
                                            <a className="dropdown-item" onClick={() => setSelectedRating(rating)}>
                                                <i className={selectedRating === rating ? "bi bi-star-fill" : "bi bi-star"}></i>
                                                <span className="ms-2">{rating} Star{rating > 1 ? "s" : ""}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;

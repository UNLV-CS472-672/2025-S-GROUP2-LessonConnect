import "../Styles/filterDropdown.css";
const FilterDropdown = () => {
    return (
        <div className="filter-dropdown-option">
            <div className="container mt-4">
                <div className="row">
                    <div id="filter-container" className="d-flex justify-content-center gap-3">
                        {/* Course Subjects Button */}
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Course Subjects
                        </button>

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
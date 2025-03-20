import '../Styles/FindTutor.css'
export default function FindTutor() {
    const tutorList = [
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Mathematics",
            name: "Cat Tutor",
            experience: "5 Years",
            address: "New York, NY"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Science",
            name: "Cat Tutor",
            experience: "3 Years",
            address: "Los Angeles, CA"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "English",
            name: "Cat Tutor",
            experience: "7 Years",
            address: "Chicago, IL"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "History",
            name: "Cat Tutor",
            experience: "6 Years",
            address: "Houston, TX"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Physics",
            name: "Cat Tutor",
            experience: "4 Years",
            address: "San Francisco, CA"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Chemistry",
            name: "Cat Tutor",
            experience: "8 Years",
            address: "Seattle, WA"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Biology",
            name: "Cat Tutor",
            experience: "5 Years",
            address: "Miami, FL"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Computer Science",
            name: "Cat Tutor",
            experience: "10 Years",
            address: "Boston, MA"
        },
        {
            image: "https://www.meowbox.com/cdn/shop/articles/Screen_Shot_2024-03-15_at_10.53.41_AM.png?v=1710525250",
            category: "Philosophy",
            name: "Cat Tutor",
            experience: "6 Years",
            address: "Denver, CO"
        }
    ];

    const subjects = ["Mathematics", "Science", "English", "History", "Programming", "Physics"];

    return (
        <div className="findTutor-section">
            <div className="container py-8">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <div className="max-w-lg">
                            <h2 className="h2 fw-semibold text-dark">
                                Find & Book <span className="text-primary">Appointment</span> with your Favorite <span className="text-primary">Tutors</span>
                            </h2>
                            <p className="mt-4 text-muted">
                                Our platform connects you with experienced educators who specialize in various subjects. Whether you're looking for academic support, music lessons, or skill-building sessions, we make it easy to find and book a tutor that fits your schedule. Start your learning journey today.
                            </p>
                            {/*<button type="submit" className="btn btn-primary mt-4 d-flex align-items-center">Explore Now</button>*/}
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <img
                            src="assets/images/Pic4.jpg"
                            className="img-fluid"
                            alt="Image"
                        />
                    </div>
                </div>
            </div>
            <div className="container mt-4 text-center mb-4">
                <h2 className="fw-bold display-6">
                    Search <span className="text-primary">Tutors</span>
                </h2>
                <h2 className="text-secondary fs-4">Find your tutor and book a session in one click!</h2>

                <div className="d-flex justify-content-center mt-3">
                    <div className="search-container d-flex rounded-pill border p-2">
                        <i className="bi bi-search text-muted fs-5 ms-2"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Enter subject or tutor name"

                        />
                        <i className="bi bi-geo-alt text-muted fs-5 ms-3"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Enter location"
                        />
                        <button type="submit" className="btn btn-primary rounded-pill ms-2">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <h2 className="fw-bold fs-3 mt-5 mb-5">Popular Tutors</h2>
                <div className="row mt-4">
                    {tutorList.map((tutor, index) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-5" key={index}>
                            <div className="tutor-card">
                                <div className="card-img-wrapper">
                                    <img src={tutor.image} alt="Tutor" className="card-img-top" />
                                    <div className="badge-category">
                                        {tutor.category}
                                        <div className="dropdown-content">
                                            {subjects.map((subject, i) => (
                                                <div key={i} className="dropdown-item">
                                                    {subject}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="fw-bold">{tutor.name}</h5>
                                    <p className="fw-semibold">{tutor.experience}</p>
                                    <p className="text-muted">{tutor.address}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

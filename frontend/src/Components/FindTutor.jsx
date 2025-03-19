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
            category: "Economics",
            name: "Cat Tutor",
            experience: "6 Years",
            address: "Denver, CO"
        }
    ];

    return (
        <>
            {/*Add your code below this line*/}
            <div className="findTutor-section">
                <div className="container mt-4 text-center">
                    <div className="mb-4">
                        <h2 className="fw-bold display-5">
                            Search <span className="text-primary">Tutors</span>
                        </h2>
                        <h2 className="text-secondary fs-4">Find your tutor and book a session in one click</h2>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <input type="text" className="form-control w-50 me-2" placeholder="Enter subject or tutor name" />
                        <button type="submit" className="btn btn-primary d-flex align-items-center">
                            <i className="bi bi-search me-2"></i>
                            Search
                        </button>
                    </div>
                </div>

                <div className="container mt-5">
                    <h2 className="fw-bold fs-4">Popular Tutors</h2>
                    <div className="row mt-4">
                        {tutorList.map((tutor, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card tutor-card h-100 shadow-sm">
                                    <div className="position-relative">
                                        <img src={tutor.image} alt="Tutor" className="card-img-top rounded-top" />
                                        <span className="badge bg-primary position-absolute top-0 start-0 m-2">{tutor.category}</span>
                                    </div>
                                    <div className="card-body text-center">
                                        <h5 className="fw-bold">{tutor.name}</h5>
                                        <p className="text-primary fw-semibold">{tutor.experience}</p>
                                        <p className="text-muted">{tutor.address}</p>
                                        <button className="btn btn-outline-primary rounded-pill w-100 mt-2">Book Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

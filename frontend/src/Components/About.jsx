
export default function About() {
    return (
        <>
            <section id="about-us" className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold">Add Title</h2>
                    <p className="lead">
                        add subtitle
                    </p>
                    <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet culpa explicabo modi perferendis? Aut ea ipsa iusto laudantium magnam, molestias nostrum placeat porro provident quisquam quod similique, temporibus vitae!
                    </p>
                    <div className="d-flex justify-content-center">
                        <img
                            src="assets/UNLV.png"
                            alt="UNLV"
                            className="img-fluid rounded"
                            style={{ maxWidth: "400px" }}
                        />
                    </div>
                </div>
            </section>

            <section id="our-project" className="py-5" style={{ backgroundColor: "#e2e3e5", textAlign: "center" }}>
                <div className="container">
                    <h2 className="fw-bold">Add Title 2</h2>
                    <p className="lead">
                        Add subtitle
                    </p>
                    <p className="text-muted">
                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium at blanditiis ea eum ipsa ipsum laboriosam laudantium maiores minus nemo nihil nisi pariatur quam quasi ratione soluta, ut veniam? Incidunt.
                    </p>
                </div>
            </section>

            <section id="our-team" className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold">Add Title 3</h2>
                    <p className="lead">Add Subtitle</p>
                    <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi consequatur error esse magnam officiis ratione recusandae ut. Doloremque error labore odit quae quidem voluptas! Eaque earum excepturi expedita quas.
                    </p>
                    <ul className="list-unstyled text-muted">
                        {[
                            "Dorian Akhavan",
                            "Abdulrahman Alharbi",
                            "Ashley Arellano",
                            "Franklin La Rosa Diaz",
                            "Jose Alarcon",
                            "Christopher Liscano",
                            "Ethan Zambrano",
                            "Aviendha Andrus",
                            "Sameer Issa",
                            "Allison Kameda",
                            "Charles Joseph Ballesteros",
                        ].map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-center mt-4">
                        <img
                            src="assets/team_photo.jpg"
                            alt="Our Team"
                            className="img-fluid rounded"
                            style={{ maxWidth: "600px" }}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

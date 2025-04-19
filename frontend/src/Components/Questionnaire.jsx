import { useState } from "react";
import confetti from "canvas-confetti";
import "../Styles/Questionnaire.css";

export default function Questionnaire({ userRole, onComplete }) {
    const isStudent = userRole === 3;
    const isTutor = userRole === 1;

    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        preferred_contact_method: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        school_type: "",
        grade_level: "",
        college_year: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        // Tutor-only
        city: "",
        state: "",
        subjects: "",
        bio: "",
        hourly_rate: "",
        education_status: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const studentSteps = [
        [
            {
                label: "📬 How should we contact you?",
                name: "preferred_contact_method",
                type: "select",
                options: ["Email", "Phone"]
            },
            ...(formData.preferred_contact_method === "Email"
                ? [{
                    label: "✉️ What's your preferred email?",
                    name: "email",
                    type: "text"
                }]
                : formData.preferred_contact_method === "Phone"
                    ? [{
                        label: "📞 What's your preferred phone number?",
                        name: "phone_number",
                        type: "text"
                    }]
                    : []),
            {
                label: "🎂 When’s your birthday?",
                name: "date_of_birth",
                type: "date"
            }
        ],
        [
            {
                label: "🏫 Are you in high school or college?",
                name: "school_type",
                type: "select",
                options: ["HighSchool", "College"]
            },
            ...(formData.school_type === "HighSchool"
                ? [{
                    label: "🎓 What grade are you in (1–12)?",
                    name: "grade_level",
                    type: "number"
                }]
                : formData.school_type === "College"
                    ? [{
                        label: "🎓 What year are you in college?",
                        name: "college_year",
                        type: "select",
                        options: ["Freshman", "Sophomore", "Junior", "Senior"]
                    }]
                    : []),
            {
                label: "👤 Who should we contact in an emergency?",
                name: "emergency_contact_name",
                type: "text"
            }
        ],
        [
            {
                label: "📞 What's their phone number?",
                name: "emergency_contact_phone",
                type: "text"
            }
        ]
    ];

    const tutorSteps = [
        [
            {
                label: "🌎 What U.S. state do you tutor in?",
                name: "state",
                type: "select",
                options: [
                    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
                ]
            },
            {
                label: "🏙️ What city are you located in?",
                name: "city",
                type: "text"
            },
            {
                label: "📚 What subjects do you teach?",
                name: "subjects",
                type: "text"
            }
        ],
        [
            {
                label: "🧑‍🏫 Write a short bio so students and parents can learn more about you.",
                name: "bio",
                type: "textarea"
            },
            {
                label: "🎓 Are you currently a college student or a graduate?",
                name: "education_status",
                type: "select",
                options: ["College Student", "Graduate"]
            },
            {
                label: "💵 What’s your hourly rate in USD?",
                name: "hourly_rate",
                type: "number"
            }
        ]
    ];

    const steps = isStudent ? studentSteps : isTutor ? tutorSteps : [];

    const currentFields = steps[step] || [];

    const handleNext = () => {
        for (const field of currentFields) {
            const val = formData[field.name];
            const isOptional = field.name === "college_year" && formData.school_type !== "college";
            if (!isOptional && (!val || val.toString().trim() === "")) {
                alert(`Please complete: ${field.label}`);
                return;
            }
        }

        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        console.log("✅ Final Submission:", formData);
        localStorage.setItem("questionnaireCompleted", "true");

        confetti({ particleCount: 700, spread: 150, origin: { y: 0.7 } });

        if (onComplete) onComplete();
    };

    return (
        <div className="container questionnaire-wrapper mt-5">
            <div className="card shadow p-4 wider-card">
                {currentFields.map((field, idx) => (
                    <div className="form-group mb-4" key={idx}>
                        <label className="form-label fw-semibold">{field.label}</label>
                        {field.type === "select" ? (
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">-- Select --</option>
                                {field.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : field.type === "textarea" ? (
                            <textarea
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="form-control"
                                rows={3}
                            />
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="form-control"
                            />
                        )}
                    </div>
                ))}

                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleBack}
                        disabled={step === 0}
                    >
                        ⬅ Back
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleNext}
                    >
                        {step === steps.length - 1 ? "Finish 🎉" : "Next ➡"}
                    </button>
                </div>
            </div>
        </div>
    );
}

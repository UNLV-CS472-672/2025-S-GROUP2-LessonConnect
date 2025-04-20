import { useState } from "react";
import "../Styles/Questionnaire.css";
import confetti from "canvas-confetti";
import PropTypes from "prop-types";


export default function Questionnaire({ userRole, onComplete }) {
    const isStudent = userRole === 3;
    const isTutor = userRole === 1;

    const subjectOptions = [
        "Math", "Science", "English", "History",
        "Spanish", "French", "Biology", "Chemistry",
        "Physics", "Computer Science", "Art", "Music",
        "Economics", "Psychology", "Writing", "Other"
    ];

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
        city: "",
        state: "",
        bio: "",
        hourly_rate: "",
        subjects: [],
        custom_subject: "",
        education_status: ""
    });

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateField = (field, value) => {
        switch (field.name) {
            case "email":
                return /\S+@\S+\.\S+/.test(value);
            case "phone_number":
            case "emergency_contact_phone":
                return /^[0-9]{7,15}$/.test(value);
            case "grade_level":
                return /^[1-9]$|^1[0-2]$/.test(value);
            case "hourly_rate":
                return /^[0-9]+$/.test(value); // only whole numbers
            case "city":
            case "emergency_contact_name":
                return /^[A-Za-z\s]+$/.test(value.trim());
            case "college_year":
            case "education_status":
            case "preferred_contact_method":
            case "school_type":
            case "state":
                return value !== "";
            default:
                return value.trim() !== "";
        }
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
                options: ["highschool", "college"]
            },
            ...(formData.school_type === "highschool"
                ? [{
                    label: "🎓 What grade are you in (1–12)?",
                    name: "grade_level",
                    type: "number"
                }]
                : formData.school_type === "college"
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
                type: "checkbox-grid",
                options: subjectOptions
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
                type: "text-dollar"
            }
        ]
    ];

    const steps = isStudent ? studentSteps : isTutor ? tutorSteps : [];
    const currentFields = steps[step] || [];

    const handleNext = () => {
        let errors = {};

        for (const field of currentFields) {
            const value = formData[field.name];
            const isOptional = field.name === "college_year" && formData.school_type !== "college";

            if (field.type === "checkbox-grid") continue;
            if (!isOptional && !validateField(field, value)) {
                errors[field.name] = true;
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
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
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
                                className={`form-select ${formErrors[field.name] ? "is-invalid" : ""}`}
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
                                className={`form-control ${formErrors[field.name] ? "is-invalid" : ""}`}
                                rows={3}
                            />
                        ) : field.type === "checkbox-grid" ? (
                            <>
                                <div className="checkbox-grid">
                                    {field.options.map((subject, i) => (
                                        <div className="form-check" key={i}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`subject-${i}`}
                                                checked={formData.subjects.includes(subject)}
                                                onChange={() => {
                                                    const updated = formData.subjects.includes(subject)
                                                        ? formData.subjects.filter(s => s !== subject)
                                                        : [...formData.subjects, subject];
                                                    setFormData(prev => ({ ...prev, subjects: updated }));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`subject-${i}`}>
                                                {subject}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {formData.subjects.includes("Other") && (
                                    <div className="other-subject-input mt-3">
                                        <label className="form-label">✏️ Please specify other subject(s):</label>
                                        <input
                                            type="text"
                                            name="custom_subject"
                                            value={formData.custom_subject}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g. Latin, Film Studies..."
                                        />
                                    </div>
                                )}
                            </>
                        ) : field.type === "text-dollar" ? (
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="hourly_rate"
                                    value={`$${formData.hourly_rate}`}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            hourly_rate: e.target.value.replace(/[^0-9]/g, "")
                                        }))
                                    }
                                    className={`form-control ${formErrors.hourly_rate ? "is-invalid" : ""}`}
                                    placeholder="$25"
                                />
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className={`form-control ${formErrors[field.name] ? "is-invalid" : ""}`}
                                placeholder={
                                    field.name === "city" ? "e.g. Las Vegas"
                                        : field.name === "phone_number" || field.name === "emergency_contact_phone" ? "e.g. 7021234567"
                                            : field.name === "email" ? "e.g. name@example.com"
                                                : ""
                                }
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
Questionnaire.propTypes = {
    userRole: PropTypes.number.isRequired,
    onComplete: PropTypes.func
};

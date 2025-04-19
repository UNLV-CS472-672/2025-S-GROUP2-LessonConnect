import { useState } from "react";
import "../Styles/Questionnaire.css";

export default function Questionnaire({ userRole, onComplete }) {
    const isTutor = userRole === 1;
    const isStudent = userRole === 3;

    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        phone_number: "",
        date_of_birth: "",
        preferred_contact_method: "email",
        // Tutor
        city: "",
        state: "",
        bio: "",
        hourly_rate: "",
        subjects: [],
        // Student
        grade_level: 1,
        preferred_subjects: [],
        emergency_contact_name: "",
        emergency_contact_phone_number: "",
    });

    const prompts = [
        { question: "📱 What’s the best number to reach you?", field: "phone_number", type: "text" },
        { question: "🎂 When’s your birthday?", field: "date_of_birth", type: "date" },
        { question: "📬 How should we contact you?", field: "preferred_contact_method", type: "select", options: ["email", "phone", "sms", "none"],
        },
        ...(isTutor ? [
            { question: "🏙️ Which city do you tutor in?", field: "city", type: "text" },
            { question: "🌎 And what’s your state abbreviation?", field: "state", type: "text" },
            { question: "🧑‍🏫 Tell us a little about yourself!", field: "bio", type: "textarea" },
            { question: "💵 What’s your hourly rate in USD?", field: "hourly_rate", type: "number" },
        ] : []),
        ...(isStudent ? [
            { question: "📚 What grade are you in (1–12)?", field: "grade_level", type: "number" },
            { question: "👤 Who should we contact in an emergency?", field: "emergency_contact_name", type: "text" },
            { question: "📞 What's their phone number?", field: "emergency_contact_phone_number", type: "text" },
        ] : []),
    ];

    const currentPrompt = prompts[step];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => {
        const currentField = currentPrompt.field;
        const value = formData[currentField];

        if (!value || value.toString().trim() === "") {
            alert("This question is required.");
            return;
        }

        if (step < prompts.length - 1) {
            setStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        console.log("✅ Questionnaire completed:", formData);
        localStorage.setItem("questionnaireCompleted", "true");
        if (onComplete) onComplete();
    };

    return (
        <div className="container questionnaire-wrapper mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-3">{currentPrompt.question}</h2>

                {currentPrompt.type === "select" ? (
                    <select
                        name={currentPrompt.field}
                        value={formData[currentPrompt.field]}
                        onChange={handleChange}
                        className="form-select mb-3"
                    >
                        {currentPrompt.options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : currentPrompt.type === "textarea" ? (
                    <textarea
                        name={currentPrompt.field}
                        value={formData[currentPrompt.field]}
                        onChange={handleChange}
                        className="form-control mb-3"
                        rows={4}
                    />
                ) : (
                    <input
                        type={currentPrompt.type}
                        name={currentPrompt.field}
                        value={formData[currentPrompt.field]}
                        onChange={handleChange}
                        className="form-control mb-3"
                    />
                )}

                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleBack}
                        disabled={step === 0}
                    >
                        ⬅ Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                    >
                        {step === prompts.length - 1 ? "Finish 🎉" : "Next ➡"}
                    </button>
                </div>
            </div>
        </div>
    );
}

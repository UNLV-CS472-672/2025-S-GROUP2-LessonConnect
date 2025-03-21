import "../Styles/Schedule.css";
import { useEffect, useState } from "react";

const tips = [
    "Consistency beats intensity — a little progress each day adds up.",
    "Study smarter, not longer. Take breaks and stay sharp.",
    "Mistakes are proof you're trying. Keep going!",
    "The secret to getting ahead is getting started.",
    "You don’t have to be perfect, just keep showing up.",
    "Discipline is choosing between what you want now and what you want most.",
    "Your future self will thank you for studying today."
];

export default function Schedule() {
    const [dailyTip, setDailyTip] = useState("");
    const [tasks, setTasks] = useState([
        { id: 1, task: "Review Algebra practice problems", completed: false },
        { id: 2, task: "Watch 20 minutes of Physics lecture", completed: true },
        { id: 3, task: "Complete Chemistry quiz", completed: false },
        { id: 4, task: "Read 10 pages from History textbook", completed: false }
    ]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * tips.length);
        setDailyTip(tips[randomIndex]);
    }, []);

    const toggleTask = (id) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className="user-view-section-page">
            <section className="greeting">
                <div className="inner-container">
                    <h1 className="fade-in">👋 Welcome back, student!</h1>
                    <p className="subheading">Ready to level up your skills today?</p>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="inner-container dashboard-layout">
                    <div className="button-grid">
                        {["Schedule Appt Tutor", "Profile", "Gaming Stats", "Talk to Your Tutor", "Messages", "Pomodoro Timer"].map((text, i) => (
                            <div className="button-card" key={i}>
                                <img src="/assets/images/UNLV_pic.png" alt={text} />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="popular-tutors-side">
                        <h2>Popular Tutors</h2>
                        {[
                            { subject: "Math", name: "Prof. Jane Doe", experience: "5 Years" },
                            { subject: "Physics", name: "Dr. Bruce Banner", experience: "88 Years" },
                            { subject: "Chemistry", name: "Ms. Sara Kim", experience: "4 Years" }
                        ].map((tutor, i) => (
                            <div className="tutor-card" key={i}>
                                <img src="/assets/images/UNLV_pic.png" alt={tutor.name} />
                                <div className="tutor-info">
                                    <span className="subject-tag">{tutor.subject}</span>
                                    <h3>{tutor.name}</h3>
                                    <p>{tutor.experience}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="extra-section">
                <div className="inner-container tip-todo-container">
                    <div className="todo-list">
                        <h3>Daily To-Do List</h3>
                        <ul>
                            {tasks.map((item) => (
                                <li key={item.id} className={item.completed ? "completed" : ""}>
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={() => toggleTask(item.id)}
                                    />
                                    <span>{item.task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="tip-section">
                        <h3>Tip of the Day</h3>
                        <blockquote>{dailyTip}</blockquote>
                    </div>
                </div>
            </section>
        </div>
    );
}

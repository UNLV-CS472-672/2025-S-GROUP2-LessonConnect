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
        <>
            <section className="greeting">
                <div className="inner-container">
                    <h1 className="fade-in">👋 Welcome back, Jose!</h1>
                    <p className="subheading">Ready to level up your skills today?</p>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="inner-container dashboard-layout">
                    <div className="button-grid">
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Schedule Appt Tutor" />
                            <span>Schedule Appt Tutor</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Profile" />
                            <span>Profile</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Gaming Stats" />
                            <span>Gaming Stats</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Talk to Your Tutor" />
                            <span>Talk to Your Tutor</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Messages" />
                            <span>Messages</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Pomodoro Timer" />
                            <span>Pomodoro Timer</span>
                        </div>
                    </div>

                    <div className="popular-tutors-side">
                        <h2>Popular Tutors</h2>
                        <div className="tutor-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Tutor 1" />
                            <div className="tutor-info">
                                <span className="subject-tag">Math</span>
                                <h3>Prof. Jane Doe</h3>
                                <p>5 Years</p>
                            </div>
                        </div>
                        <div className="tutor-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Tutor 2" />
                            <div className="tutor-info">
                                <span className="subject-tag">Physics</span>
                                <h3>Dr. Bruce Banner</h3>
                                <p>88 Years</p>
                            </div>
                        </div>

                        <div className="tutor-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Tutor 4" />
                            <div className="tutor-info">
                                <span className="subject-tag">Chemistry</span>
                                <h3>Ms. Sara Kim</h3>
                                <p>4 Years</p>
                            </div>
                        </div>
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
        </>
    );
}


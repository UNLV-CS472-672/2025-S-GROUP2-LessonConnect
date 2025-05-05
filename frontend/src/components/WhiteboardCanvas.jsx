// WhiteboardCanvas.jsx
import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../Styles/WhiteboardCanvas.css";

/* ────────────────────────────
   Small inline sub‑components
──────────────────────────────── */
const mockTutors = [
    { id: 1, name: "Dr. Smith",  subject: "Physics",   avatar: "/avatars/t1.png", status: "online"  },
    { id: 2, name: "Prof. Lin",  subject: "Calculus",  avatar: "/avatars/t2.png", status: "away"    },
    { id: 3, name: "Ms. Patel",  subject: "Chemistry", avatar: "/avatars/t3.png", status: "offline" },
];

/* Contact list */
function ContactList({ selectedId, onSelect }) {
    return (
        <aside className="lc-panel glass-card contact-list animate-fade-in">
            <h3 className="panel-title">Tutors</h3>
            {mockTutors.map((t) => (
                <button
                    key={t.id}
                    className={`contact-card neon-hover ${selectedId === t.id ? "selected" : ""}`}
                    onClick={() => onSelect(t)}
                >
                    <span className={`status-dot ${t.status}`} />
                    <img src="/assets/images/assignment_icon.png" alt="" />
                    <div>
                        <div className="contact-name">{t.name}</div>
                        <div className="contact-subject">{t.subject}</div>
                    </div>
                </button>
            ))}
        </aside>
    );
}

ContactList.propTypes = {
    selectedId: PropTypes.number,
    onSelect:    PropTypes.func.isRequired,
};

/* ——— VideoView ——— */
function VideoView({ tutor, onBack }) {
    return (
        <aside className="lc-panel glass-card video-view animate-slide-in-left">
            <header className="video-header">
                <button className="icon-btn back-btn" onClick={onBack}>
                    <i className="fas fa-arrow-left" /> <span className="lbl">Back</span>
                </button>
                <span className="video-title">{tutor.name}</span>
            </header>

            <div className="video-box">
                <img src="/assets/images/assignment_icon.png" alt="" />
            </div>

            <footer className="call-controls">
                {[
                    ["fas fa-microphone", "Mute"],
                    ["fas fa-video",       "Video"],
                    ["fas fa-volume-mute", "Deafen"],
                ].map(([icon, lbl]) => (
                    <button key={lbl} className="circle-btn icon-btn">
                        <i className={icon} />
                        <span className="lbl">{lbl}</span>
                    </button>
                ))}
            </footer>
        </aside>
    );
}

VideoView.propTypes = {
    tutor: PropTypes.shape({
        id:      PropTypes.number.isRequired,
        name:    PropTypes.string.isRequired,
        subject: PropTypes.string,
        avatar:  PropTypes.string,
        status:  PropTypes.string,
    }).isRequired,
    onBack: PropTypes.func.isRequired,
};

/* ——— ChatPanel ——— */
function ChatPanel({ tutor, messages, setMessages, onBack }) {
    const inputRef = useRef(null);
    const listRef  = useRef(null);

    useEffect(() => {
        listRef.current?.scrollTo(0, listRef.current.scrollHeight);
    }, [messages]);

    const sendMsg = () => {
        const txt = inputRef.current.value.trim();
        if (!txt) return;
        setMessages((p) => [...p, { id: Date.now(), from: "me", body: txt }]);
        inputRef.current.value = "";
        setTimeout(
            () =>
                setMessages((p) => [
                    ...p,
                    { id: Date.now() + 1, from: tutor.name, body: "👍" },
                ]),
            900
        );
    };

    return (
        <aside className="lc-panel glass-card chat-panel animate-slide-in-right">
            <header className="chat-header">
                <span>Chat · {tutor.name}</span>
                <button className="icon-btn back-btn" onClick={onBack}>
                    <i className="fas fa-times" />
                    <span className="lbl">Close</span>
                </button>
            </header>

            <div ref={listRef} className="chat-log">
                {messages.map((m) => (
                    <div key={m.id} className={`chat-bubble ${m.from === "me" ? "sent" : "recv"}`}>
                        {m.body}
                    </div>
                ))}
            </div>

            <div className="chat-input-row">
                <input
                    ref={inputRef}
                    placeholder="Type a message…"
                    onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                />
                <button className="send-btn icon-btn" onClick={sendMsg}>
                    <i className="fas fa-paper-plane" />
                    <span className="lbl">Send</span>
                </button>
            </div>
        </aside>
    );
}

ChatPanel.propTypes = {
    tutor: PropTypes.shape({
        id:      PropTypes.number.isRequired,
        name:    PropTypes.string.isRequired,
        subject: PropTypes.string,
        avatar:  PropTypes.string,
        status:  PropTypes.string,
    }).isRequired,
    messages:     PropTypes.arrayOf(
        PropTypes.shape({
            id:   PropTypes.number.isRequired,
            from: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired,
        })
    ).isRequired,
    setMessages:  PropTypes.func.isRequired,
    onBack:       PropTypes.func.isRequired,
};

/* ────────────────────────────
   Main component
──────────────────────────────── */
export default function WhiteboardCanvas() {
    /* session state */
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [chatMessages, setChatMessages]   = useState([]);

    /* drawing state */
    const canvasRef  = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineColor, setLineColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);
    const [undoStack, setUndoStack] = useState([]);

    const colors = [
        "#000000", "#7F7F7F", "#BFBFBF", "#FFFFFF",
        "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00",
        "#00FF00", "#00FF7F", "#00FFFF", "#007FFF",
        "#0000FF", "#7F00FF", "#FF00FF", "#FF007F",
    ];

    /* canvas init */
    const fitCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const scale = window.devicePixelRatio || 1;
        canvas.width  = canvas.clientWidth  * scale;
        canvas.height = canvas.clientHeight * scale;
        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);
        ctx.lineCap  = "round";
        ctx.lineJoin = "round";
        contextRef.current = ctx;
    };

    useEffect(() => {
        fitCanvas();
        window.addEventListener("resize", fitCanvas);
        return () => window.removeEventListener("resize", fitCanvas);
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = lineColor;
            contextRef.current.lineWidth   = lineWidth;
        }
    }, [lineColor, lineWidth]);

    useEffect(() => {
        if (canvasRef.current && contextRef.current) {
            const c = canvasRef.current;
            setUndoStack([contextRef.current.getImageData(0, 0, c.width, c.height)]);
        }
    }, []);

    const pushUndo = () => {
        const c = canvasRef.current;
        setUndoStack((st) => [...st, contextRef.current.getImageData(0, 0, c.width, c.height)]);
    };

    const undo = () => {
        if (undoStack.length <= 1) return clearCanvas();
        const next = [...undoStack];
        next.pop();
        contextRef.current.putImageData(next[next.length - 1], 0, 0);
        setUndoStack(next);
    };

    /* draw handlers */
    const startDraw = ({ nativeEvent: { offsetX: x, offsetY: y } }) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);
    };
    const draw = ({ nativeEvent: { offsetX: x, offsetY: y } }) => {
        if (!isDrawing) return;
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };
    const stopDraw = () => {
        if (!isDrawing) return;
        contextRef.current.closePath();
        setIsDrawing(false);
        pushUndo();
    };

    /* util */
    const clearCanvas = () => {
        const c = canvasRef.current;
        contextRef.current.clearRect(0, 0, c.width, c.height);
    };
    const dlCanvas = () => {
        const link = document.createElement("a");
        link.download = "lessonconnect_drawing.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    /* eraser toggle */
    useEffect(() => {
        const eraser = document.querySelector(".tool-btn[title='Eraser']");
        const pencil = document.querySelector(".tool-btn[title='Pencil']");
        if (!eraser || !pencil) return;

        const toErase = () => {
            contextRef.current.globalCompositeOperation = "destination-out";
            setLineWidth(20);
        };
        const toDraw = () => {
            contextRef.current.globalCompositeOperation = "source-over";
            setLineWidth(3);
        };

        eraser.addEventListener("click", toErase);
        pencil.addEventListener("click", toDraw);
        return () => {
            eraser.removeEventListener("click", toErase);
            pencil.removeEventListener("click", toDraw);
        };
    }, []);

    /* ────────────── UI ────────────── */
    return (
        <div className="whiteboard-container">
            <div className="session-container">
                {/* LEFT PANEL */}
                {selectedTutor ? (
                    <VideoView tutor={selectedTutor} onBack={() => setSelectedTutor(null)} />
                ) : (
                    <ContactList
                        selectedId={selectedTutor?.id}
                        onSelect={(t) => {
                            setSelectedTutor(t);
                            setChatMessages([]); // reset chat per tutor
                        }}
                    />
                )}

                {/* CENTER */}
                <div className="canvas-column">
                    {/* primary toolbar */}
                    <div className="whiteboard-topbar glass-card">
                        <div className="whiteboard-title">Whiteboard</div>
                        <div className="whiteboard-tools">
                            {[
                                ["Cursor",   "mouse-pointer"],
                                ["Pencil",   "pencil-alt"],
                                ["Rectangle","square"],
                                ["Circle",   "circle"],
                                ["Eraser",   "eraser"],
                            ].map(([t, ic]) => (
                                <button key={t} title={t} className="tool-btn neon-hover">
                                    <i className={`fas fa-${ic}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* secondary toolbar */}
                    <div className="toolbar glass-card">
                        <label className="color-label">Color:</label>
                        {colors.map((c) => (
                            <button
                                key={c}
                                className="color-button"
                                style={{ backgroundColor: c }}
                                onClick={() => setLineColor(c)}
                            />
                        ))}
                        <label className="width-label">
                            Brush:
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={lineWidth}
                                onChange={(e) => setLineWidth(Number(e.target.value))}
                            />
                        </label>
                        {[
                            ["Clear",     clearCanvas],
                            ["Undo",      undo],
                            ["Download",  dlCanvas],
                        ].map(([t, f]) => (
                            <button key={t} className="action-button neon-hover" onClick={f}>
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* canvas */}
                    <div
                        className="canvas-container glass-card"
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                    >
                        <canvas ref={canvasRef} className="drawing-canvas" />
                    </div>
                </div>

                {/* RIGHT PANEL */}
                {selectedTutor && (
                    <ChatPanel
                        tutor={selectedTutor}
                        messages={chatMessages}
                        setMessages={setChatMessages}
                        onBack={() => setSelectedTutor(null)}
                    />
                )}
            </div>
        </div>
    );
}

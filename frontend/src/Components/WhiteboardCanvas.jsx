import { useRef, useState, useEffect } from "react";
import "../Styles/WhiteboardCanvas.css";

export default function WhiteboardCanvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [lineColor, setLineColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scale = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;

        const context = canvas.getContext("2d");
        context.scale(scale, scale);
        context.lineCap = "round";
        context.lineJoin = "round";

        contextRef.current = context;
    };

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            contextRef.current.closePath();
            setIsDrawing(false);
        }
    };

    return (
        <div className="whiteboard-container">
            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
        </div>
    );
    const colorOptions = ["#000000", "#7F7F7F", "#BFBFBF", "#FFFFFF",
        "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00",
        "#00FF00", "#00FF7F", "#00FFFF", "#007FFF",
        "#0000FF", "#7F00FF", "#FF00FF", "#FF007F"];

// Inserted inside return()
    <div className="toolbar glass-card">
        <label className="color-label">Color:</label>
        {colorOptions.map((color) => (
            <button
                key={color}
                className="color-button"
                style={{ backgroundColor: color }}
                onClick={() => setLineColor(color)}
            />
        ))}
        <label className="width-label">
            Brush:
            <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(e.target.value)}
            />
        </label>
    </div>

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "lessonconnect_drawing.png";
        link.href = canvas.toDataURL();
        link.click();
    };

// Add buttons in toolbar div
    <button className="action-button neon-hover" onClick={clearCanvas}>
        Clear
    </button>
    <button className="action-button neon-hover" onClick={downloadCanvas}>
        Download
    </button>

    useEffect(() => {
        function handleResize() {
            resizeCanvas();
        }
        resizeCanvas();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = lineColor;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [lineColor, lineWidth]);
    const handleToolClick = (toolName) => {
        alert(`Tool ${toolName} clicked! (Feature to be added)`);
    };

// Inside return(), topbar div
    <div className="whiteboard-topbar glass-card">
        <div className="whiteboard-title">Whiteboard</div>
        <div className="whiteboard-tools">
            <button className="tool-btn neon-hover" onClick={() => handleToolClick("Cursor")}>
                <i className="fas fa-mouse-pointer"></i>
            </button>
            <button className="tool-btn neon-hover" onClick={() => handleToolClick("Pencil")}>
                <i className="fas fa-pencil-alt"></i>
            </button>
            <button className="tool-btn neon-hover" onClick={() => handleToolClick("Rectangle")}>
                <i className="far fa-square"></i>
            </button>
            <button className="tool-btn neon-hover" onClick={() => handleToolClick("Circle")}>
                <i className="far fa-circle"></i>
            </button>
            <button className="tool-btn neon-hover" onClick={() => handleToolClick("Eraser")}>
                <i className="fas fa-eraser"></i>
            </button>
        </div>
    </div>

    // Wrap canvas and toolbar in structured divs
    <div className="whiteboard-canvas-container">
        {/* Insert toolbars and canvas here */}
    </div>
}
// WhiteboardCanvas.jsx
import { useRef, useState, useEffect } from "react";
import "../Styles/WhiteboardCanvas.css";

export default function WhiteboardCanvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [lineColor, setLineColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

    // 1) NEW: Undo stack state
    const [undoStack, setUndoStack] = useState([]);

    // Example color palette
    const colorOptions = [
        "#000000", "#7F7F7F", "#BFBFBF", "#FFFFFF",
        "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00",
        "#00FF00", "#00FF7F", "#00FFFF", "#007FFF",
        "#0000FF", "#7F00FF", "#FF00FF", "#FF007F"
    ];

    /**
     * Set up the canvas size and context for drawing
     */
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

    // Resize only on mount or window resize (not on color/width changes)
    useEffect(() => {
        function handleResize() {
            resizeCanvas();
        }
        // Initial sizing
        resizeCanvas();

        // If you want dynamic resizing
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Update stroke style on color/width changes
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = lineColor;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [lineColor, lineWidth]);

    // 2) NEW: After the canvas is set up, capture its initial state for undo
    useEffect(() => {
        if (canvasRef.current && contextRef.current) {
            const canvas = canvasRef.current;
            const ctx = contextRef.current;
            const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setUndoStack([initialData]);
        }
    }, []);

    // 3) NEW: Helper function to push the current canvas to undo stack
    const pushToUndoStack = () => {
        if (!canvasRef.current || !contextRef.current) return;
        const canvas = canvasRef.current;
        const data = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack((prevStack) => [...prevStack, data]);
    };

    // 4) NEW: Undo logic
    const undoLastAction = () => {
        if (undoStack.length > 1) {
            const newStack = [...undoStack];
            newStack.pop(); // Remove current state
            const previous = newStack[newStack.length - 1];
            contextRef.current.putImageData(previous, 0, 0);
            setUndoStack(newStack);
        } else {
            // If nothing left, just clear
            clearCanvas();
        }
    };

    // Mouse event handlers
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
            // 5) NEW: After each stroke, capture the final canvas state
            pushToUndoStack();
        }
    };

    // Utility buttons
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

    // Placeholder for extra tools
    const handleToolClick = (toolName) => {
        alert(`Tool ${toolName} clicked! (Feature to be added)`);
    };

    // 6) NEW: Listen for Eraser button click => switch to eraser mode
    useEffect(() => {
        const eraserButton = document.querySelector(".tool-btn[title='Eraser']");
        if (!eraserButton) return;

        const handleEraserClick = () => {
            if (contextRef.current) {
                contextRef.current.globalCompositeOperation = "destination-out";
                // Optionally adjust eraser size:
                setLineWidth(20);
            }
        };

        eraserButton.addEventListener("click", handleEraserClick);
        return () => {
            eraserButton.removeEventListener("click", handleEraserClick);
        };
    }, []);

    // 7) NEW: Listen for Pencil button click => switch back to normal drawing
    useEffect(() => {
        const pencilButton = document.querySelector(".tool-btn[title='Pencil']");
        if (!pencilButton) return;

        const handlePencilClick = () => {
            if (contextRef.current) {
                contextRef.current.globalCompositeOperation = "source-over";
                // Reset brush size if desired:
                setLineWidth(3);
            }
        };

        pencilButton.addEventListener("click", handlePencilClick);
        return () => {
            pencilButton.removeEventListener("click", handlePencilClick);
        };
    }, []);

    return (
        // Unique parent class to scope styling:
        <div className="whiteboard-container">
            <div className="whiteboard-canvas-container">
                {/* Top bar */}
                <div className="whiteboard-topbar glass-card">
                    <div className="whiteboard-title">Whiteboard</div>
                    <div className="whiteboard-tools">
                        <button
                            className="tool-btn neon-hover"
                            title="Cursor"
                            onClick={() => handleToolClick("Cursor")}
                        >
                            <i className="fas fa-mouse-pointer"></i>
                        </button>
                        <button
                            className="tool-btn neon-hover"
                            title="Pencil"
                            onClick={() => handleToolClick("Pencil")}
                        >
                            <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                            className="tool-btn neon-hover"
                            title="Rectangle"
                            onClick={() => handleToolClick("Rectangle")}
                        >
                            <i className="far fa-square"></i>
                        </button>
                        <button
                            className="tool-btn neon-hover"
                            title="Circle"
                            onClick={() => handleToolClick("Circle")}
                        >
                            <i className="far fa-circle"></i>
                        </button>
                        <button
                            className="tool-btn neon-hover"
                            title="Eraser"
                            onClick={() => handleToolClick("Eraser")}
                        >
                            <i className="fas fa-eraser"></i>
                        </button>
                    </div>
                </div>

                {/* Secondary toolbar */}
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
                    <button className="action-button neon-hover" onClick={clearCanvas}>
                        Clear
                    </button>

                    {/* 8) NEW: Undo button */}
                    <button className="action-button neon-hover" onClick={undoLastAction}>
                        Undo
                    </button>

                    <button className="action-button neon-hover" onClick={downloadCanvas}>
                        Download
                    </button>
                </div>

                {/* Canvas */}
                <div
                    className="canvas-container glass-card"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                >
                    <canvas ref={canvasRef} className="drawing-canvas" />
                </div>
            </div>
        </div>
    );
}

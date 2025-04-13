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
}
export default function SignUp() {
    return (
        <div>
        </div>
    );
}

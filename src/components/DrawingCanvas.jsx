import React, { useRef, useState, useEffect } from 'react';
import DraggableTextField from './DraggableTextField';

function DrawingCanvas({ selectedShape, pageSize, borderStyle, shapes, onShapeAdd, pageLayout, showRulers }) {
    const canvasRef = useRef(null);
    const horizontalRulerRef = useRef(null);
    const verticalRulerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentShape, setCurrentShape] = useState(null);
    const [textFields, setTextFields] = useState([]);

    const canvasWidth = pageLayout === "portrait" ? pageSize.width : pageSize.height;
    const canvasHeight = pageLayout === "landscape" ? pageSize.height : pageSize.width;

    const drawRuler = (canvas, length, isHorizontal) => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.font = '12px Arial';
        context.lineWidth = 1;

        const step = 10; // Every 10 pixels

        for (let i = 0; i <= length; i += step) {
            context.beginPath();
            if (isHorizontal) {
                context.moveTo(i, 15); // Horizontal Ruler
                context.lineTo(i, i % 50 === 0 ? 0 : 10);
                if (i % 50 === 0) {
                    context.fillText(i, i + 2, 10); // Add labels every 50px
                }
            } else {
                context.moveTo(15, i); // Vertical Ruler
                context.lineTo(i % 50 === 0 ? 0 : 10, i);
                if (i % 50 === 0) {
                    context.fillText(i, 10, i + 12);
                }
            }
            context.stroke();
        }
    };

    useEffect(() => {
        if (showRulers) {
            const horizontalRuler = horizontalRulerRef.current;
            const verticalRuler = verticalRulerRef.current;
            drawRuler(horizontalRuler, canvasWidth, true); // Horizontal Ruler
            drawRuler(verticalRuler, canvasHeight, false); // Vertical Ruler
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach((shape) => drawShape(context, shape, false));
        textFields.forEach((textField) => {
            context.font = '16px Arial';
            context.fillStyle = 'black';
            context.fillText(textField.text, textField.x, textField.y);
        });
    }, [shapes, textFields, canvasWidth, canvasHeight, showRulers]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach((shape) => drawShape(context, shape, false));

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        const newShape = {
            type: selectedShape,
            startX: startPos.x,
            startY: startPos.y,
            endX: x,
            endY: y,
            preview: true,
        };
        setCurrentShape(newShape);
        drawShape(context, newShape, true);
    };

    const stopDrawing = () => {
        if (!currentShape) return;
        setIsDrawing(false);
        const newShape = { ...currentShape, preview: false };
        onShapeAdd(newShape);
        setCurrentShape(null);
    };

    const drawShape = (context, shape, isPreview) => {
        context.beginPath();
        if (shape.type === 'rectangle') {
            if (isPreview) context.setLineDash([5, 5]);
            context.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
        } else if (shape.type === 'line') {
            if (isPreview) context.setLineDash([5, 5]);

            const deltaX = shape.endX - shape.startX;
            const deltaY = shape.endY - shape.startY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                context.moveTo(shape.startX, shape.startY);
                context.lineTo(shape.endX, shape.startY);
            } else {
                context.moveTo(shape.startX, shape.startY);
                context.lineTo(shape.startX, shape.endY);
            }
        }
        context.stroke();
        context.setLineDash([]);
    };

    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', backgroundColor: 'grey' }}>
            {/* Vertical Ruler (Left) */}
            {showRulers && (
                <canvas
                    ref={verticalRulerRef}
                    width={30} // Fixed width for vertical ruler
                    height={canvasHeight}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: `calc(50% - ${canvasWidth / 2}px - 30px)`,
                        backgroundColor: 'white',
                        border: '1px solid black', // Ruler border for clarity
                        zIndex: 10, // Ensure the ruler is above the canvas
                    }}
                />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Horizontal Ruler (Top) */}
                {showRulers && (
                    <canvas
                        ref={horizontalRulerRef}
                        width={canvasWidth}
                        height={30} // Fixed height for horizontal ruler
                        style={{
                            position: 'absolute',
                            top: -22,
                            left: `calc(50% - ${canvasWidth / 2}px)`,
                            backgroundColor: 'white',
                            border: '1px solid black', // Ruler border for clarity
                            zIndex: 10, // Ensure the ruler is above the canvas
                        }}
                    />
                )}

                {/* Drawing Canvas */}
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    style={{
                        border: `10px ${borderStyle} black`,
                        backgroundColor: 'white',
                        marginTop: 30, // Adjust this if necessary to clear the horizontal ruler
                    }}
                />
            </div>

            {/* Draggable Text Fields */}
            {textFields.map((textField, index) => (
                <DraggableTextField
                    key={index}
                    x={textField.x}
                    y={textField.y}
                    text={textField.text}
                    onTextChange={(newText) => {
                        const newTextFields = [...textFields];
                        newTextFields[index].text = newText;
                        setTextFields(newTextFields);
                    }}
                    onDrop={(x, y) => {
                        const newTextFields = [...textFields];
                        newTextFields[index] = { ...newTextFields[index], x, y };
                        setTextFields(newTextFields);
                    }}
                />
            ))}
        </div>
    );
}

export default DrawingCanvas;

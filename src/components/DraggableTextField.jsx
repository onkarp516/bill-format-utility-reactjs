import React, { useState } from 'react';

function DraggableTextField({ x, y, text, onTextChange, onDrop }) {
    const [position, setPosition] = useState({ x, y });
    const [isDragging, setIsDragging] = useState(false);

    const startDrag = (e) => {
        e.preventDefault();
        setIsDragging(true);
        e.dataTransfer.setData('text/plain', ''); // Required for dragging to work
    };

    const drag = (e) => {
        if (isDragging) {
            const newX = e.clientX - 50; // Adjust as needed
            const newY = e.clientY - 10; // Adjust as needed
            setPosition({ x: newX, y: newY });
        }
    };

    const stopDrag = (e) => {
        setIsDragging(false);
        onDrop(position.x, position.y);
    };

    return (
        <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            draggable
            onDragStart={startDrag}
            onDrag={drag}
            onDragEnd={stopDrag}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                border: '1px dashed black',
                backgroundColor: 'blue',
                color: "red",
                padding: '2px',
                cursor: 'move'
            }}
        />
    );
}

export default DraggableTextField;

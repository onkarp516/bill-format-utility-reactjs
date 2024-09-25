import React, { useRef, useEffect } from 'react';

function CanvasComponent() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        // Set up canvas drawing properties (similar to JavaFX's GraphicsContext)
        context.backgroundColor = '#fff'; // White background
        context.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas

        // Additional drawing logic goes here
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} />;
}

export default CanvasComponent;

import React from 'react';

function Toolbox({ selectedShape, onShapeSelect, pageLayout, onPageLayoutChange, pageSizes, onPageSizeChange, borderStyle, onBorderStyleChange, onUndo, onRedo, onSave, onClearPage, showRulers, onRulerToggle }) {
    const shapes = ['line', 'rectangle', 'text'];
    const borderStyles = ["none", "solid", "dashed", "dotted"];

    return (
        <div className="toolbox d-flex align-items-center" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
            {shapes.map((shape) => (
                <button
                    key={shape}
                    className={`btn btn-outline-primary me-2 ${shape === selectedShape ? 'active' : ''}`}
                    onClick={() => onShapeSelect(shape)}
                >
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
            ))}

            <select className="form-select me-2" onChange={(e) => onPageSizeChange(pageSizes[e.target.value])}>
                {pageSizes.map((size, index) => (
                    <option key={index} value={index}>{size.name}</option>
                ))}
            </select>

            <select className="form-select me-2" value={pageLayout} onChange={(e) => onPageLayoutChange(e.target.value)}>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
            </select>

            <select className="form-select" value={borderStyle} onChange={(e) => onBorderStyleChange(e.target.value)}>
                {borderStyles.map(style => (
                    <option key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</option>
                ))}
            </select>
            <label className="form-check-label me-2">
                <input
                    type="checkbox"
                    checked={showRulers}
                    onChange={onRulerToggle}
                    className="form-check-input"
                />
                Show Rulers
            </label>
            <button onClick={onUndo}>Undo</button>
            <button onClick={onRedo}>Redo</button>
            <button onClick={onSave}>Save</button>
            <button variant="danger" onClick={onClearPage}>Clear</button>
        </div>
    );
}

export default Toolbox;

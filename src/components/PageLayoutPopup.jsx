import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function PageLayoutPopup({
    closePopup,
    handlePageSizeChange,
    handleBorderStyleChange,
    pageSizes
}) {
    const [selectedPageSize, setSelectedPageSize] = useState(pageSizes[4]); // Default A4
    const [borderStyle, setBorderStyle] = useState('none');
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');
    const [pageLayout, setPageLayout] = useState('landscape');

    const handlePageSizeSelect = (e) => {
        const newSize = pageSizes.find(size => size.name === e.target.value);
        setSelectedPageSize(newSize);
        handlePageSizeChange(newSize);
    };

    const handleBorderStyleSelect = (e) => {
        setBorderStyle(e.target.value);
        handleBorderStyleChange(e.target.value);
    };

    const handleSubmit = () => {
        if (customWidth && customHeight) {
            handlePageSizeChange({ width: parseFloat(customWidth), height: parseFloat(customHeight) });
        }
        closePopup();
    };

    return (
        <Modal show={true} onHide={closePopup} centered>
            <Modal.Header closeButton>
                <Modal.Title>Customize Page Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Width Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>Width (mm)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter width"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Height Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>Height (mm)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter height"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Page Layout Select */}
                    <Form.Group className="mb-3">
                        <Form.Label>Page Layout</Form.Label>
                        <Form.Control as="select" value={pageLayout} onChange={(e) => setPageLayout(e.target.value)}>
                            <option value="landscape">Landscape</option>
                            <option value="portrait">Portrait</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Border Style Select */}
                    <Form.Group className="mb-3">
                        <Form.Label>Border Style</Form.Label>
                        <Form.Control as="select" value={borderStyle} onChange={handleBorderStyleSelect}>
                            <option value="none">None</option>
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closePopup}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Apply
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PageLayoutPopup;

import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ImagePreview({ imageSrc, onConfirm, onCancel, pageSize }) {
  return (
    <Modal show onHide={onCancel} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Preview Image</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '60vh' }} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImagePreview;

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './TrainerRequestModal.css';

const TrainerRequestModal = ({ show, handleClose, handleSendRequest, trainerId }) => {
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email && !phone) {
            setError('Debes proporcionar al menos un correo electrónico o un número de teléfono.');
            return;
        }

        const requestData = {
            trainerId,
            description,
            email,
            phone
        };

        try {
            await handleSendRequest(requestData);
            handleClose();
        } catch (error) {
            setError('Error al enviar solicitud. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="trainer-request-modal">
            <Modal.Header closeButton>
                <Modal.Title>Enviar Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mt-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone" className="mt-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    <Button variant="primary" type="submit" className="mt-3">
                        Enviar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TrainerRequestModal;

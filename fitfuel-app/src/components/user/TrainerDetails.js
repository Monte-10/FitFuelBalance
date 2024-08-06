import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Modal } from 'react-bootstrap';
import './TrainerDetails.css'; // Importar el archivo de estilos

const TrainerDetails = () => {
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/trainer-details/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
                });
                setTrainerDetails(response.data);
            } catch (error) {
                console.error("Error al cargar los detalles del entrenador:", error);
            }
        };

        const fetchSpecialties = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/specialties/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
                });
                setSpecialties(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error al cargar las especialidades:", error);
            }
        };

        fetchTrainerDetails();
        fetchSpecialties();
    }, []);

    const handleRemoveTrainer = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/remove_trainer/`, {}, {
                headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
            });
            setTrainerDetails(null);
            setShowConfirm(false);
            console.log("Entrenador eliminado exitosamente", response.data);
        } catch (error) {
            console.error("Error al eliminar el entrenador:", error);
        }
    };

    const handleConfirmClose = () => setShowConfirm(false);
    const handleConfirmShow = () => setShowConfirm(true);

    const getSpecialtyNames = (specialtyIds) => {
        return specialtyIds.map(id => {
            const specialty = specialties.find(spec => spec.id === id);
            return specialty ? specialty.name : id;
        }).join(', ');
    };

    return (
        <Container className="trainer-details-container mt-4">
            <h2 className="text-center mb-4">Detalles del Entrenador</h2>
            {trainerDetails ? (
                <Card className="trainer-details-card mx-auto">
                    <Card.Body>
                        <Card.Title className="text-center">{trainerDetails.username}</Card.Title>
                        <Card.Text><strong>Especialidades:</strong> {getSpecialtyNames(trainerDetails.specialties || [])}</Card.Text>
                        <Card.Text><strong>Tipo de Entrenador:</strong> {trainerDetails.trainer_type}</Card.Text>
                        <Card.Text><strong>Email:</strong> {trainerDetails.communication_email}</Card.Text>
                        <Card.Text><strong>Teléfono:</strong> {trainerDetails.phone}</Card.Text>
                        <div className="text-center">
                            <Button variant="danger" onClick={handleConfirmShow}>Eliminar Entrenador</Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <p className="text-center">No tienes un entrenador asignado.</p>
            )}

            <Modal show={showConfirm} onHide={handleConfirmClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar a tu entrenador?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleConfirmClose}>Cancelar</Button>
                    <Button variant="danger" onClick={handleRemoveTrainer}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TrainerDetails;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import TrainerRequestModal from './TrainerRequestModal';
import './TrainerList.css'; // Importar el archivo de estilos

// Mapear IDs de especialidades a nombres
const specialtyMap = {
    1: 'Pérdida de peso',
    2: 'Ganancia muscular',
    3: 'Fuerza',
    4: 'Resistencia',
    5: 'Flexibilidad',
    6: 'Otro'
};

// Mapear tipos de entrenador a nombres amigables
const trainerTypeMap = {
    'trainer': 'Entrenador',
    'nutritionist': 'Nutricionista',
    'both': 'Entrenador y Nutricionista'
};

// Componente para cada entrenador en la lista
const Trainer = ({ trainer, onSendRequest }) => (
    <Card className="trainer-card mb-3">
        <Card.Body>
            <Card.Title>{trainer.username}</Card.Title>
            <Card.Text>
                <strong>Especialidades:</strong> {trainer.specialties.map(id => specialtyMap[id]).join(', ')}<br />
                <strong>Tipo de Entrenador:</strong> {trainerTypeMap[trainer.trainer_type]}
            </Card.Text>
            <Button variant="primary" onClick={() => onSendRequest(trainer.id)}>Enviar Solicitud</Button>
        </Card.Body>
    </Card>
);

const TrainerList = () => {
    const [trainers, setTrainers] = useState([]);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        specialty: '',
        trainerType: '',
        name: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrainerId, setSelectedTrainerId] = useState(null);
    const trainersPerPage = 5;

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/trainers/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                console.log('Datos de entrenadores:', response.data.results); // Verificar los datos obtenidos
                setTrainers(Array.isArray(response.data.results) ? response.data.results : []);
            } catch (error) {
                console.error("Error al buscar entrenadores:", error);
                setError("Error al buscar entrenadores. Por favor, inténtelo de nuevo más tarde.");
            }
        };

        fetchTrainers();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const filteredTrainers = Array.isArray(trainers) ? trainers.filter(trainer => {
        const specialtyFilter = filters.specialty === '' || trainer.specialties.includes(parseInt(filters.specialty));
        const trainerTypeFilter = filters.trainerType === '' || trainer.trainer_type === filters.trainerType;
        const nameFilter = filters.name === '' || trainer.username.toLowerCase().includes(filters.name.toLowerCase());
        return specialtyFilter && trainerTypeFilter && nameFilter;
    }) : [];

    const indexOfLastTrainer = currentPage * trainersPerPage;
    const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
    const currentTrainers = filteredTrainers.slice(indexOfFirstTrainer, indexOfLastTrainer);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSendRequest = (trainerId) => {
        setSelectedTrainerId(trainerId);
        setShowModal(true);
    };

    const handleRequestFormSubmit = async (requestData) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/send_request/`, requestData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                }
            });
            console.log("Solicitud enviada con éxito", response.data);
            setShowModal(false);
        } catch (error) {
            console.error("Error al enviar solicitud:", error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <Container className="trainer-list-container mt-4">
            <h2 className="text-center mb-4">Entrenadores Disponibles</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <Form className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="formSpecialty">
                            <Form.Label>Filtrar por Especialidad:</Form.Label>
                            <Form.Control as="select" name="specialty" value={filters.specialty} onChange={handleFilterChange}>
                                <option value="">Todas</option>
                                {Object.entries(specialtyMap).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formTrainerType">
                            <Form.Label>Filtrar por Tipo de Entrenador:</Form.Label>
                            <Form.Control as="select" name="trainerType" value={filters.trainerType} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                {Object.entries(trainerTypeMap).map(([type, name]) => (
                                    <option key={type} value={type}>{name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formName">
                            <Form.Label>Buscar por Nombre:</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={filters.name} 
                                onChange={handleFilterChange} 
                                placeholder="Nombre del entrenador" 
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {currentTrainers.length > 0 ? (
                currentTrainers.map((trainer) => (
                    <Trainer key={trainer.id} trainer={trainer} onSendRequest={handleSendRequest} />
                ))
            ) : (
                <p className="text-center">No se encontraron entrenadores.</p>
            )}
            <Pagination className="justify-content-center">
                {Array.from({ length: Math.ceil(filteredTrainers.length / trainersPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <TrainerRequestModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSendRequest={handleRequestFormSubmit}
                trainerId={selectedTrainerId}
            />
        </Container>
    );
};

export default TrainerList;

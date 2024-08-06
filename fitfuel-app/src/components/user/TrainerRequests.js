import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import './TrainerRequests.css';

const TrainerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/requests/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setRequests(response.data);
            } catch (error) {
                setError('Error al cargar las solicitudes');
                console.error("Error al cargar las solicitudes:", error.response?.data || error.message);
            }
        };

        fetchRequests();
    }, [apiUrl]);

    const handleRequestAction = async (requestId, action) => {
        try {
            const response = await axios.post(`${apiUrl}/user/handle_request/${requestId}/`, { action }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                }
            });
            console.log(`Solicitud ${action} con éxito`, response.data);
            setRequests(requests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} solicitud:`, error.response?.data || error.message);
            setError(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} solicitud`);
        }
    };

    return (
        <Container className="trainer-requests-container mt-4">
            <h2 className="text-center">Solicitudes de Entrenamiento</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <Table striped bordered hover className="requests-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Descripción</th>
                        <th>Correo Electrónico</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id}>
                            <td>{request.regular_user.username}</td>
                            <td>{request.description}</td>
                            <td>{request.email}</td>
                            <td>{request.phone}</td>
                            <td>
                                <Button variant="success" onClick={() => handleRequestAction(request.id, 'accept')}>
                                    Aceptar
                                </Button>
                                <Button variant="danger" onClick={() => handleRequestAction(request.id, 'reject')} className="ms-2">
                                    Rechazar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default TrainerRequests;

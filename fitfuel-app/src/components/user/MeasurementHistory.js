import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';

const MeasurementHistory = () => {
    const [measurements, setMeasurements] = useState([]);
    const [error, setError] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                const response = await axios.get(`${apiUrl}/measurements/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setMeasurements(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                setError('Error al cargar el historial de medidas');
                console.error("Error al cargar el historial de medidas:", error.response?.data || error.message);
            }
        };

        fetchMeasurements();
    }, [apiUrl]);

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!measurements.length) {
        return <p>No hay datos de medidas disponibles.</p>;
    }

    return (
        <Container className="mt-4">
            <h2>Historial de Medidas</h2>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Peso</th>
                        <th>Altura</th>
                        <th>Cuello</th>
                        <th>Hombro</th>
                        <th>Pecho</th>
                        <th>Cintura</th>
                        <th>Cadera</th>
                        <th>Brazo</th>
                        <th>Glúteo</th>
                        <th>Pierna Superior</th>
                        <th>Pierna Media</th>
                        <th>Pierna Inferior</th>
                    </tr>
                </thead>
                <tbody>
                    {measurements.map((measurement, index) => (
                        <tr key={index}>
                            <td>{new Date(measurement.date).toLocaleDateString()}</td>
                            <td>{measurement.weight}</td>
                            <td>{measurement.height}</td>
                            <td>{measurement.neck}</td>
                            <td>{measurement.shoulder}</td>
                            <td>{measurement.chest}</td>
                            <td>{measurement.waist}</td>
                            <td>{measurement.hip}</td>
                            <td>{measurement.arm}</td>
                            <td>{measurement.glute}</td>
                            <td>{measurement.upper_leg}</td>
                            <td>{measurement.middle_leg}</td>
                            <td>{measurement.lower_leg}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default MeasurementHistory;

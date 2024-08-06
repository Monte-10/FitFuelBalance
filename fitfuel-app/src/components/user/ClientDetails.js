import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './ClientDetails.css';  // Asegúrate de enlazar el archivo CSS correctamente

const ClientDetails = ({ clientId, onBack }) => {
    const [client, setClient] = useState(null);
    const [error, setError] = useState('');
    const [measurements, setMeasurements] = useState([]);
    const [assignedOptions, setAssignedOptions] = useState([]);
    const [dayOptions, setDayOptions] = useState({});
    const [chartType, setChartType] = useState('line');
    const [selectedMeasurements, setSelectedMeasurements] = useState(['weight']);
    const [timeRange, setTimeRange] = useState('1year');
    const [viewType, setViewType] = useState('chart');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/regularusers/${clientId}/details/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Client details response:", response.data);
                setClient(response.data);
            } catch (error) {
                setError('Error al cargar los detalles del cliente');
                console.error("Error al cargar los detalles del cliente:", error.response?.data || error.message);
            }
        };

        const fetchMeasurements = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/measurements/history/${clientId}/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Measurements response:", response.data);
                setMeasurements(response.data);
            } catch (error) {
                setError('Error al cargar los datos de las mediciones');
                console.error("Error al cargar los datos de las mediciones:", error.response?.data || error.message);
            }
        };

        const fetchAssignedOptions = async () => {
            try {
                const response = await axios.get(`${apiUrl}/nutrition/assignedoptions/client/${clientId}/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Assigned options response:", response.data);
                setAssignedOptions(response.data);
                const dayOptionIds = new Set();
                response.data.forEach(option => {
                    if (option.monday_option) dayOptionIds.add(option.monday_option);
                    if (option.tuesday_option) dayOptionIds.add(option.tuesday_option);
                    if (option.wednesday_option) dayOptionIds.add(option.wednesday_option);
                    if (option.thursday_option) dayOptionIds.add(option.thursday_option);
                    if (option.friday_option) dayOptionIds.add(option.friday_option);
                    if (option.saturday_option) dayOptionIds.add(option.saturday_option);
                    if (option.sunday_option) dayOptionIds.add(option.sunday_option);
                });
                await fetchDayOptions([...dayOptionIds]);
            } catch (error) {
                setError('Error al cargar las opciones asignadas');
                console.error("Error al cargar las opciones asignadas:", error.response?.data || error.message);
            }
        };

        const fetchDayOptions = async (ids) => {
            try {
                const promises = ids.map(id => 
                    axios.get(`${apiUrl}/nutrition/dayoptions/${id}/`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('authToken')}`
                        }
                    })
                );
                const responses = await Promise.all(promises);
                const dayOptionsData = responses.reduce((acc, response) => {
                    acc[response.data.id] = response.data.name;
                    return acc;
                }, {});
                setDayOptions(dayOptionsData);
            } catch (error) {
                setError('Error al cargar las opciones diarias');
                console.error("Error al cargar las opciones diarias:", error.response?.data || error.message);
            }
        };

        fetchClientDetails();
        fetchMeasurements();
        fetchAssignedOptions();
    }, [apiUrl, clientId]);

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleMeasurementChange = (e) => {
        const { value, checked } = e.target;
        setSelectedMeasurements(prevSelectedMeasurements =>
            checked
                ? [...prevSelectedMeasurements, value]
                : prevSelectedMeasurements.filter(m => m !== value)
        );
    };

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    };

    const handleViewTypeChange = (e) => {
        setViewType(e.target.value);
    };

    const filterMeasurementsByTimeRange = (measurements, timeRange) => {
        const now = new Date();
        const filteredMeasurements = measurements.filter(measurement => {
            const measurementDate = new Date(measurement.date);
            switch (timeRange) {
                case '1week':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 7;
                case '1month':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 30;
                case '3months':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 90;
                case '6months':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 180;
                case '9months':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 270;
                case '1year':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 365;
                case '2years':
                    return (now - measurementDate) / (1000 * 60 * 60 * 24) <= 730;
                default:
                    return true;
            }
        });
        return filteredMeasurements;
    };

    const getChartData = () => {
        const filteredMeasurements = filterMeasurementsByTimeRange(measurements, timeRange);
        const labels = filteredMeasurements.map(m => new Date(m.date).toLocaleDateString());

        const colors = [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(255, 122, 192, 0.6)',
            'rgba(54, 102, 105, 0.6)',
            'rgba(255, 206, 186, 0.6)',
        ];

        const datasets = selectedMeasurements.map((measurement, index) => ({
            label: measurement,
            data: filteredMeasurements.map(m => m[measurement]),
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length].replace('0.6', '1'),
            borderWidth: 1
        }));

        return {
            labels,
            datasets
        };
    };

    const renderChart = () => {
        const data = getChartData();

        switch (chartType) {
            case 'bar':
                return <Bar data={data} />;
            case 'pie':
                return <Pie data={data} />;
            default:
                return <Line data={data} />;
        }
    };

    const renderTable = () => (
        <Table striped bordered hover className="mt-4">
            <thead>
                <tr>
                    <th>Fecha</th>
                    {selectedMeasurements.map((measurement, index) => (
                        <th key={index}>{measurement}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {filterMeasurementsByTimeRange(measurements, timeRange).map((measurement, index) => (
                    <tr key={index}>
                        <td>{new Date(measurement.date).toLocaleDateString()}</td>
                        {selectedMeasurements.map((key, idx) => (
                            <td key={idx}>{measurement[key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderAssignedOptionsTable = () => (
        <Table striped bordered hover className="mt-4">
            <thead>
                <tr>
                    <th>Fecha de Inicio</th>
                    <th>Opción</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                </tr>
            </thead>
            <tbody>
                {assignedOptions.map((option, index) => (
                    <tr key={index}>
                        <td>{new Date(option.start_date).toLocaleDateString()}</td>
                        <td>{option.option}</td>
                        <td className={option.monday_option ? 'selected-option' : ''}>{dayOptions[option.monday_option] || ''}</td>
                        <td className={option.tuesday_option ? 'selected-option' : ''}>{dayOptions[option.tuesday_option] || ''}</td>
                        <td className={option.wednesday_option ? 'selected-option' : ''}>{dayOptions[option.wednesday_option] || ''}</td>
                        <td className={option.thursday_option ? 'selected-option' : ''}>{dayOptions[option.thursday_option] || ''}</td>
                        <td className={option.friday_option ? 'selected-option' : ''}>{dayOptions[option.friday_option] || ''}</td>
                        <td className={option.saturday_option ? 'selected-option' : ''}>{dayOptions[option.saturday_option] || ''}</td>
                        <td className={option.sunday_option ? 'selected-option' : ''}>{dayOptions[option.sunday_option] || ''}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!client) {
        return <p>Cargando...</p>;
    }

    const latestMeasurements = measurements.length > 0 ? measurements[measurements.length - 1] : {};

    return (
        <Container className="container-clientdetails mt-4">
            <Button variant="secondary" onClick={onBack}>Volver</Button>
            <h2 className="mt-4">Detalles del Cliente</h2>
            <Table striped bordered hover className="mt-4">
                <tbody>
                    <tr>
                        <td><strong>Nombre de Usuario</strong></td>
                        <td>{client.username}</td>
                    </tr>
                    <tr>
                        <td><strong>Correo Electrónico</strong></td>
                        <td>{client.communication_email || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Edad</strong></td>
                        <td>{client.profile ? client.profile.age : 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Género</strong></td>
                        <td>{client.profile ? client.profile.gender : 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Peso</strong></td>
                        <td>{client.weight || latestMeasurements.weight || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Altura</strong></td>
                        <td>{client.height || latestMeasurements.height || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Cuello</strong></td>
                        <td>{client.neck || latestMeasurements.neck || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Hombro</strong></td>
                        <td>{client.shoulder || latestMeasurements.shoulder || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Pecho</strong></td>
                        <td>{client.chest || latestMeasurements.chest || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Cintura</strong></td>
                        <td>{client.waist || latestMeasurements.waist || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Cadera</strong></td>
                        <td>{client.hip || latestMeasurements.hip || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Brazo</strong></td>
                        <td>{client.arm || latestMeasurements.arm || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Glúteo</strong></td>
                        <td>{client.glute || latestMeasurements.glute || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Pierna Superior</strong></td>
                        <td>{client.upper_leg || latestMeasurements.upper_leg || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Pierna Media</strong></td>
                        <td>{client.middle_leg || latestMeasurements.middle_leg || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Pierna Inferior</strong></td>
                        <td>{client.lower_leg || latestMeasurements.lower_leg || 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Teléfono</strong></td>
                        <td>{client.phone || 'No disponible'}</td>
                    </tr>
                </tbody>
            </Table>
            <Form.Group controlId="chartTypeSelect">
                <Form.Label>Tipo de Gráfico</Form.Label>
                <Form.Control as="select" value={chartType} onChange={handleChartTypeChange}>
                    <option value="line">Línea</option>
                    <option value="bar">Barras</option>
                    <option value="pie">Circular</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="measurementSelect" className="measurements-checkboxes">
                <Form.Label>Mediciones</Form.Label>
                {['weight', 'height', 'neck', 'shoulder', 'chest', 'waist', 'hip', 'arm', 'glute', 'upper_leg', 'middle_leg', 'lower_leg'].map(measurement => (
                    <Form.Check
                        key={measurement}
                        type="checkbox"
                        label={measurement}
                        value={measurement}
                        checked={selectedMeasurements.includes(measurement)}
                        onChange={handleMeasurementChange}
                    />
                ))}
            </Form.Group>
            <Form.Group controlId="timeRangeSelect">
                <Form.Label>Rango de Tiempo</Form.Label>
                <Form.Control as="select" value={timeRange} onChange={handleTimeRangeChange}>
                    <option value="1week">1 Semana</option>
                    <option value="1month">1 Mes</option>
                    <option value="3months">3 Meses</option>
                    <option value="6months">6 Meses</option>
                    <option value="9months">9 Meses</option>
                    <option value="1year">1 Año</option>
                    <option value="2years">2 Años</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="viewTypeSelect">
                <Form.Label>Tipo de Vista</Form.Label>
                <Form.Control as="select" value={viewType} onChange={handleViewTypeChange}>
                    <option value="chart">Gráfico</option>
                    <option value="table">Tabla</option>
                </Form.Control>
            </Form.Group>
            {viewType === 'chart' ? renderChart() : renderTable()}
            <h3 className="mt-4">Opciones Asignadas</h3>
            {renderAssignedOptionsTable()}
        </Container>
    );
};

export default ClientDetails;

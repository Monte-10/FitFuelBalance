import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        bio: '',
        age: '',
        gender: 'male',
        image: null,
        specialties: [],
        trainer_type: 'trainer',
        communication_email: '',
        phone: ''
    });
    const [regularUser, setRegularUser] = useState({
        weight: '',
        height: '',
        neck: '',
        shoulder: '',
        chest: '',
        waist: '',
        hip: '',
        arm: '',
        glute: '',
        upper_leg: '',
        middle_leg: '',
        lower_leg: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [isTrainer, setIsTrainer] = useState(false);
    const [error, setError] = useState('');
    const [measurements, setMeasurements] = useState([]);
    const [chartType, setChartType] = useState('line');
    const [selectedMeasurements, setSelectedMeasurements] = useState(['weight']);
    const [timeRange, setTimeRange] = useState('1month');
    const [viewType, setViewType] = useState('chart');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/profile/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                const { profile: profileData = {}, trainer = {}, regular_user = {} } = response.data;

                setProfile({
                    bio: profileData.bio || '',
                    age: profileData.age || '',
                    gender: profileData.gender || 'male',
                    image: profileData.image || null,
                    specialties: trainer.specialties || [],
                    trainer_type: trainer.trainer_type || 'trainer',
                    communication_email: trainer.communication_email || regular_user.communication_email || '',
                    phone: trainer.phone || regular_user.phone || ''
                });

                setRegularUser({
                    weight: regular_user.weight || '',
                    height: regular_user.height || '',
                    neck: regular_user.neck || '',
                    shoulder: regular_user.shoulder || '',
                    chest: regular_user.chest || '',
                    waist: regular_user.waist || '',
                    hip: regular_user.hip || '',
                    arm: regular_user.arm || '',
                    glute: regular_user.glute || '',
                    upper_leg: regular_user.upper_leg || '',
                    middle_leg: regular_user.middle_leg || '',
                    lower_leg: regular_user.lower_leg || ''
                });

                setIsTrainer(!!trainer.specialties?.length);

                if (!trainer.specialties?.length) {
                    const measurementsResponse = await axios.get(`${apiUrl}/user/measurements/history/${response.data.id}/`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('authToken')}`
                        }
                    });
                    setMeasurements(Array.isArray(measurementsResponse.data) ? measurementsResponse.data : []);
                }
            } catch (error) {
                setError("Error al cargar el perfil");
                console.error("Error al cargar el perfil:", error.response?.data || error.message);
            }
        };

        const fetchSpecialties = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/specialties/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setSpecialties(response.data.results);
            } catch (error) {
                setError("Error al cargar especialidades");
                console.error("Error al cargar especialidades:", error.response?.data || error.message);
            }
        };

        fetchProfile();
        fetchSpecialties();
    }, [apiUrl]);

    useEffect(() => {
        if (measurements.length > 0) {
            const latestMeasurement = measurements[measurements.length - 1];
            setRegularUser({
                weight: latestMeasurement.weight || '',
                height: latestMeasurement.height || '',
                neck: latestMeasurement.neck || '',
                shoulder: latestMeasurement.shoulder || '',
                chest: latestMeasurement.chest || '',
                waist: latestMeasurement.waist || '',
                hip: latestMeasurement.hip || '',
                arm: latestMeasurement.arm || '',
                glute: latestMeasurement.glute || '',
                upper_leg: latestMeasurement.upper_leg || '',
                middle_leg: latestMeasurement.middle_leg || '',
                lower_leg: latestMeasurement.lower_leg || ''
            });
        }
    }, [measurements]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleRegularUserChange = (e) => {
        const { name, value } = e.target;
        setRegularUser(prevRegularUser => ({ ...prevRegularUser, [name]: value }));
    };

    const handleSpecialtyChange = (e) => {
        const { value, checked } = e.target;
        setProfile(prevProfile => {
            const newSpecialties = checked
                ? [...prevProfile.specialties, parseInt(value)]
                : prevProfile.specialties.filter(specialty => specialty !== parseInt(value));
            return { ...prevProfile, specialties: newSpecialties };
        });
    };

    const handleImageChange = (e) => {
        setProfile(prevProfile => ({ ...prevProfile, image: e.target.files[0] }));
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('bio', profile.bio);
        formData.append('age', profile.age);
        formData.append('gender', profile.gender);
        formData.append('communication_email', profile.communication_email);
        formData.append('phone', profile.phone);
        if (profile.image instanceof File) {
            formData.append('image', profile.image);
        }

        if (isTrainer) {
            formData.append('trainer_type', profile.trainer_type);
            formData.append('specialties', JSON.stringify(profile.specialties));
        }

        try {
            const response = await axios.put(`${apiUrl}/user/profile/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile({
                bio: response.data.bio || '',
                age: response.data.age || '',
                gender: response.data.gender || 'male',
                image: response.data.image || null,
                specialties: response.data.trainer?.specialties || [],
                trainer_type: response.data.trainer?.trainer_type || 'trainer',
                communication_email: response.data.communication_email || '',
                phone: response.data.phone || ''
            });

        } catch (error) {
            setError(`Error al actualizar el perfil: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            console.error("Error al actualizar el perfil:", error.response?.data || error.message);
        }
    };

    const handleSubmitMeasurements = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${apiUrl}/user/measurements/`, regularUser, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const measurementsResponse = await axios.get(`${apiUrl}/user/measurements/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                }
            });
            setMeasurements(Array.isArray(measurementsResponse.data) ? measurementsResponse.data : []);

        } catch (error) {
            setError(`Error al guardar las medidas: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            console.error("Error al guardar las medidas:", error.response?.data || error.message);
        }
    };

    const filterMeasurementsByTimeRange = () => {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case '1week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case '1month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case '3months':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '6months':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '9months':
                startDate = new Date(now.setMonth(now.getMonth() - 9));
                break;
            case '1year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            case '2years':
                startDate = new Date(now.setFullYear(now.getFullYear() - 2));
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        return Array.isArray(measurements) ? measurements.filter(measurement => new Date(measurement.date) >= startDate) : [];
    };

    const getChartData = () => {
        const filteredMeasurements = filterMeasurementsByTimeRange();
        const labels = filteredMeasurements.map(m => new Date(m.date).toLocaleDateString());

        const datasets = selectedMeasurements.map((measurement, index) => ({
            label: measurement,
            data: filteredMeasurements.map(m => m[measurement]),
            backgroundColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 0.6)`,
            borderColor: `rgba(${index * 50}, ${index * 100}, ${index * 150}, 1)`,
            borderWidth: 1,
            fill: false,
            spanGaps: true
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

    const renderTable = () => {
        const filteredMeasurements = filterMeasurementsByTimeRange();

        return (
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        {selectedMeasurements.map((measurement, index) => (
                            <th key={index}>{measurement}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredMeasurements.map((measurement, index) => (
                        <tr key={index}>
                            <td>{new Date(measurement.date).toLocaleDateString()}</td>
                            {selectedMeasurements.map((key, i) => (
                                <td key={i}>{measurement[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleMeasurementChange = (e) => {
        const { value, checked } = e.target;
        setSelectedMeasurements(prev =>
            checked ? [...prev, value] : prev.filter(m => m !== value)
        );
    };

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    };

    const handleViewTypeChange = (e) => {
        setViewType(e.target.value);
    };

    return (
        <div className="container-profile mt-4">
            <h2 className="title-profile">Perfil</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmitProfile}>
                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Biografía</label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="form-control"
                        value={profile.bio}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Edad</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        className="form-control"
                        value={profile.age}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Género</label>
                    <select
                        id="gender"
                        name="gender"
                        className="form-select"
                        value={profile.gender}
                        onChange={handleChange}
                    >
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                {isTrainer && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="trainer_type" className="form-label">Tipo de Entrenador</label>
                            <select
                                id="trainer_type"
                                name="trainer_type"
                                className="form-select"
                                value={profile.trainer_type}
                                onChange={handleChange}
                            >
                                <option value="trainer">Entrenador</option>
                                <option value="nutritionist">Nutricionista</option>
                                <option value="both">Entrenador y Nutricionista</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Especialidades</label>
                            {specialties.map(specialty => (
                                <div key={specialty.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`specialty-${specialty.id}`}
                                        value={specialty.id}
                                        checked={profile.specialties.includes(specialty.id)}
                                        onChange={handleSpecialtyChange}
                                    />
                                    <label className="form-check-label" htmlFor={`specialty-${specialty.id}`}>
                                        {specialty.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <Row>
                    <Col md={6}>
                        <div className="mb-3">
                            <label htmlFor="communication_email" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                id="communication_email"
                                name="communication_email"
                                className="form-control"
                                value={profile.communication_email}
                                onChange={handleChange}
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-control"
                                value={profile.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </Col>
                </Row>
                <button type="submit" className="btn btn-primary">Guardar Cambios del Perfil</button>
            </form>
            {!isTrainer && (
                <form onSubmit={handleSubmitMeasurements}>
                    <Container>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="weight" className="form-label">Peso</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        className="form-control"
                                        value={regularUser.weight}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="height" className="form-label">Altura</label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        className="form-control"
                                        value={regularUser.height}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="neck" className="form-label">Cuello</label>
                                    <input
                                        type="number"
                                        id="neck"
                                        name="neck"
                                        className="form-control"
                                        value={regularUser.neck}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="shoulder" className="form-label">Hombro</label>
                                    <input
                                        type="number"
                                        id="shoulder"
                                        name="shoulder"
                                        className="form-control"
                                        value={regularUser.shoulder}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="chest" className="form-label">Pecho</label>
                                    <input
                                        type="number"
                                        id="chest"
                                        name="chest"
                                        className="form-control"
                                        value={regularUser.chest}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="waist" className="form-label">Cintura</label>
                                    <input
                                        type="number"
                                        id="waist"
                                        name="waist"
                                        className="form-control"
                                        value={regularUser.waist}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="hip" className="form-label">Cadera</label>
                                    <input
                                        type="number"
                                        id="hip"
                                        name="hip"
                                        className="form-control"
                                        value={regularUser.hip}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="arm" className="form-label">Brazo</label>
                                    <input
                                        type="number"
                                        id="arm"
                                        name="arm"
                                        className="form-control"
                                        value={regularUser.arm}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="glute" className="form-label">Glúteo</label>
                                    <input
                                        type="number"
                                        id="glute"
                                        name="glute"
                                        className="form-control"
                                        value={regularUser.glute}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="upper_leg" className="form-label">Pierna Superior</label>
                                    <input
                                        type="number"
                                        id="upper_leg"
                                        name="upper_leg"
                                        className="form-control"
                                        value={regularUser.upper_leg}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="middle_leg" className="form-label">Pierna Media</label>
                                    <input
                                        type="number"
                                        id="middle_leg"
                                        name="middle_leg"
                                        className="form-control"
                                        value={regularUser.middle_leg}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label htmlFor="lower_leg" className="form-label">Pierna Inferior</label>
                                    <input
                                        type="number"
                                        id="lower_leg"
                                        name="lower_leg"
                                        className="form-control"
                                        value={regularUser.lower_leg}
                                        onChange={handleRegularUserChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <button type="submit" className="btn btn-primary">Guardar Medidas</button>
                    </Container>
                </form>
            )}
            {!isTrainer && (
                <div>
                    <Form.Group controlId="viewTypeSelect" className="mt-3">
                        <Form.Label>Tipo de Vista</Form.Label>
                        <Form.Control as="select" value={viewType} onChange={handleViewTypeChange}>
                            <option value="chart">Gráfico</option>
                            <option value="table">Tabla</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="chartTypeSelect" className="mt-3">
                        <Form.Label>Tipo de Gráfico</Form.Label>
                        <Form.Control as="select" value={chartType} onChange={handleChartTypeChange}>
                            <option value="line">Línea</option>
                            <option value="bar">Barras</option>
                            <option value="pie">Circular</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="measurementSelect" className="mt-3">
                        <Form.Label>Mediciones</Form.Label>
                        {['weight', 'height', 'neck', 'shoulder', 'chest', 'waist', 'hip', 'arm', 'glute', 'upper_leg', 'middle_leg', 'lower_leg'].map((measurement) => (
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
                    <Form.Group controlId="timeRangeSelect" className="mt-3">
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
                    {viewType === 'chart' ? renderChart() : renderTable()}
                </div>
            )}
        </div>
    );
};

export default Profile;

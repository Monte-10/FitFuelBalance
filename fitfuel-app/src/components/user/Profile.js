import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Profile.css';

// Componente para el perfil básico
const BasicProfile = ({ profile, onChange, onSubmit, isEditing, onToggleEdit }) => (
    <Card className="profile-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
                👤 Información Personal
            </h5>
            <button 
                className="btn btn-outline-primary btn-sm"
                onClick={onToggleEdit}
            >
                {isEditing ? '👁️' : '✏️'}
            </button>
        </Card.Header>
        <Card.Body>
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Biografía</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="bio"
                                value={profile.bio}
                                onChange={onChange}
                                disabled={!isEditing}
                                placeholder="Cuéntanos sobre ti..."
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="age"
                                        value={profile.age}
                                        onChange={onChange}
                                        disabled={!isEditing}
                                        min="16"
                                        max="100"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Género</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={profile.gender}
                                        onChange={onChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                        <option value="other">Otro</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                📧 Email de Contacto
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="communication_email"
                                value={profile.communication_email}
                                onChange={onChange}
                                disabled={!isEditing}
                                placeholder="tu@email.com"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                📞 Teléfono
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={onChange}
                                disabled={!isEditing}
                                placeholder="+34 600 000 000"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {isEditing && (
                    <div className="text-center">
                        <button type="submit" className="btn btn-success">
                            💾 Guardar Cambios
                        </button>
                    </div>
                )}
            </Form>
        </Card.Body>
    </Card>
);

// Componente para el perfil de entrenador
const TrainerProfile = ({ profile, specialties, onChange, onSubmit, isEditing, onToggleEdit }) => (
    <Card className="profile-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
                🏋️ Perfil de Entrenador
            </h5>
            <button 
                className="btn btn-outline-primary btn-sm"
                onClick={onToggleEdit}
            >
                {isEditing ? '👁️' : '✏️'}
            </button>
        </Card.Header>
        <Card.Body>
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Entrenador</Form.Label>
                            <Form.Select
                                name="trainer_type"
                                value={profile.trainer_type}
                                onChange={onChange}
                                disabled={!isEditing}
                            >
                                <option value="trainer">Entrenador</option>
                                <option value="nutritionist">Nutricionista</option>
                                <option value="both">Entrenador y Nutricionista</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Especialidades</Form.Label>
                            <div className="specialties-grid">
                                {specialties.map(specialty => (
                                    <Form.Check
                                        key={specialty.id}
                                        type="checkbox"
                                        id={`specialty-${specialty.id}`}
                                        label={specialty.name}
                                        value={specialty.id}
                                        checked={profile.specialties.includes(specialty.id)}
                                        onChange={onChange}
                                        disabled={!isEditing}
                                        className="specialty-checkbox"
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {isEditing && (
                    <div className="text-center">
                        <button type="submit" className="btn btn-success">
                            💾 Guardar Cambios
                        </button>
                    </div>
                )}
            </Form>
        </Card.Body>
    </Card>
);

// Componente para las medidas corporales
const BodyMeasurements = ({ measurements, onSubmit, isEditing, onToggleEdit }) => {
    const [formData, setFormData] = useState({});

    // Actualizar formData cuando cambien las measurements
    useEffect(() => {
        setFormData(measurements || {});
    }, [measurements]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Filtrar solo los campos que tienen valores
        const filteredData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                filteredData[key] = parseFloat(formData[key]);
            }
        });
        
        // Solo enviar si hay al menos una medida
        if (Object.keys(filteredData).length > 0) {
            onSubmit(filteredData);
        } else {
            alert('Por favor, ingresa al menos una medida antes de guardar.');
        }
    };

    const measurementFields = [
        { name: 'weight', label: 'Peso (kg)', icon: '⚖️' },
        { name: 'height', label: 'Altura (cm)', icon: '📏' },
        { name: 'neck', label: 'Cuello (cm)', icon: '📏' },
        { name: 'shoulder', label: 'Hombro (cm)', icon: '📏' },
        { name: 'chest', label: 'Pecho (cm)', icon: '📏' },
        { name: 'waist', label: 'Cintura (cm)', icon: '📏' },
        { name: 'hip', label: 'Cadera (cm)', icon: '📏' },
        { name: 'arm', label: 'Brazo (cm)', icon: '📏' },
        { name: 'glute', label: 'Glúteo (cm)', icon: '📏' },
        { name: 'upper_leg', label: 'Pierna Superior (cm)', icon: '📏' },
        { name: 'middle_leg', label: 'Pierna Media (cm)', icon: '📏' },
        { name: 'lower_leg', label: 'Pierna Inferior (cm)', icon: '📏' }
    ];

    return (
        <Card className="profile-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    📏 Medidas Corporales
                </h5>
                <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={onToggleEdit}
                >
                    {isEditing ? '👁️ Ver' : '✏️ Editar'}
                </button>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <small className="text-muted">
                        💡 Los valores mostrados son de tu última medición registrada
                    </small>
                </div>
                
                <Form onSubmit={handleSubmit}>
                    <Row>
                        {measurementFields.map((field, index) => (
                            <Col key={field.name} md={6} lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        {field.icon} {field.label}
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        step="0.1"
                                        min="0"
                                        placeholder={formData[field.name] ? '' : 'Sin registrar'}
                                    />
                                    {formData[field.name] && (
                                        <small className="text-success">
                                            ✅ Última medida: {formData[field.name]} {field.name === 'weight' ? 'kg' : 'cm'}
                                        </small>
                                    )}
                                </Form.Group>
                            </Col>
                        ))}
                    </Row>

                    {isEditing && (
                        <div className="text-center">
                            <button type="submit" className="btn btn-success">
                                💾 Guardar Medidas
                            </button>
                        </div>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
};

// Componente para el análisis de progreso
const ProgressAnalysis = ({ measurements, selectedMeasurements, timeRange, chartType, onMeasurementChange, onTimeRangeChange, onChartTypeChange }) => {
    const chartData = {
        labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
        datasets: selectedMeasurements.map((measurement, index) => ({
            label: measurement,
            data: measurements.map(m => m[measurement]),
            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 0.6)`,
            borderColor: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 1)`,
            borderWidth: 2,
            fill: false,
            spanGaps: true,
            tension: 0.4
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#f0f0f0'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#f0f0f0' },
                grid: { color: '#444' }
            },
            y: {
                ticks: { color: '#f0f0f0' },
                grid: { color: '#444' }
            }
        }
    };

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return <Bar data={chartData} options={chartOptions} />;
            case 'pie':
                return <Pie data={chartData} options={chartOptions} />;
            default:
                return <Line data={chartData} options={chartOptions} />;
        }
    };

    return (
        <Card className="profile-card">
            <Card.Header>
                <h5 className="mb-0">
                    📊 Análisis de Progreso
                </h5>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Rango de Tiempo</Form.Label>
                            <Form.Select value={timeRange} onChange={onTimeRangeChange}>
                                <option value="1week">1 Semana</option>
                                <option value="1month">1 Mes</option>
                                <option value="3months">3 Meses</option>
                                <option value="6months">6 Meses</option>
                                <option value="1year">1 Año</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Tipo de Gráfico</Form.Label>
                            <Form.Select value={chartType} onChange={onChartTypeChange}>
                                <option value="line">Línea</option>
                                <option value="bar">Barras</option>
                                <option value="pie">Circular</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Medidas a Mostrar</Form.Label>
                            <div className="measurement-selector">
                                {['weight', 'height', 'neck', 'chest', 'waist', 'hip'].map((measurement) => (
                                    <Badge
                                        key={measurement}
                                        bg={selectedMeasurements.includes(measurement) ? "primary" : "secondary"}
                                        className="me-1 mb-1 cursor-pointer"
                                        onClick={() => onMeasurementChange(measurement)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {measurement}
                                    </Badge>
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="chart-container">
                    {renderChart()}
                </div>
            </Card.Body>
        </Card>
    );
};

// Componente principal del Profile
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
    const [measurements, setMeasurements] = useState([]);
    const [selectedMeasurements, setSelectedMeasurements] = useState(['weight']);
    const [timeRange, setTimeRange] = useState('1month');
    const [chartType, setChartType] = useState('line');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Estados de edición
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [isEditingTrainer, setIsEditingTrainer] = useState(false);
    const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch del perfil
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/user/profile/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                }
            });
            
            const { profile: profileData = {}, trainer = {}, regular_user = {}, role: userRole, id: userId } = response.data;

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

            setRole(userRole);

            if (userRole === 'regular_user') {
                try {
                    // Obtener el historial de medidas
                    const measurementsResponse = await axios.get(
                        `${apiUrl}/user/measurements/history/${userId}/`,
                        {
                            headers: {
                                'Authorization': `Token ${localStorage.getItem('authToken')}`
                            }
                        }
                    );
                    setMeasurements(Array.isArray(measurementsResponse.data) ? measurementsResponse.data : []);
                    
                    // Obtener la última medida para mostrar en el formulario
                    const latestMeasurementResponse = await axios.get(
                        `${apiUrl}/user/measurements/latest/${userId}/`,
                        {
                            headers: {
                                'Authorization': `Token ${localStorage.getItem('authToken')}`
                            }
                        }
                    );
                    
                    if (latestMeasurementResponse.data && Object.keys(latestMeasurementResponse.data).length > 0) {
                        const latestData = latestMeasurementResponse.data;
                        setRegularUser(prev => ({
                            ...prev,
                            weight: latestData.weight || prev.weight,
                            height: latestData.height || prev.height,
                            neck: latestData.neck || prev.neck,
                            shoulder: latestData.shoulder || prev.shoulder,
                            chest: latestData.chest || prev.chest,
                            waist: latestData.waist || prev.waist,
                            hip: latestData.hip || prev.hip,
                            arm: latestData.arm || prev.arm,
                            glute: latestData.glute || prev.glute,
                            upper_leg: latestData.upper_leg || prev.upper_leg,
                            middle_leg: latestData.middle_leg || prev.middle_leg,
                            lower_leg: latestData.lower_leg || prev.lower_leg
                        }));
                    }
                } catch (measurementError) {
                    console.log('No hay historial de medidas disponible');
                    setMeasurements([]);
                }
            }

        } catch (error) {
            setError("Error al cargar el perfil");
            console.error("Error al cargar el perfil:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    // Fetch de especialidades
    const fetchSpecialties = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/user/specialties/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                }
            });
            setSpecialties(response.data.results || response.data);
        } catch (error) {
            console.error("Error al cargar especialidades:", error.response?.data || error.message);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchProfile();
        fetchSpecialties();
    }, [fetchProfile, fetchSpecialties]);

    // Handlers
    const handleProfileChange = useCallback((e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSpecialtyChange = useCallback((e) => {
        const { value, checked } = e.target;
        setProfile(prev => {
            const newSpecialties = checked
                ? [...prev.specialties, parseInt(value)]
                : prev.specialties.filter(specialty => specialty !== parseInt(value));
            return { ...prev, specialties: newSpecialties };
        });
    }, []);

    const handleSubmitProfile = useCallback(async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('bio', profile.bio);
            formData.append('age', profile.age);
            formData.append('gender', profile.gender);
            formData.append('communication_email', profile.communication_email);
            formData.append('phone', profile.phone);

            const response = await axios.put(`${apiUrl}/user/profile/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile(prev => ({
                ...prev,
                bio: response.data.profile?.bio || prev.bio,
                age: response.data.profile?.age || prev.age,
                gender: response.data.profile?.gender || prev.gender,
                communication_email: response.data.trainer?.communication_email || response.data.regular_user?.communication_email || prev.communication_email,
                phone: response.data.trainer?.phone || response.data.regular_user?.phone || prev.phone
            }));

            setSuccess('Perfil actualizado correctamente');
            setIsEditingBasic(false);
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            setError(`Error al actualizar el perfil: ${error.response?.data?.detail || error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    }, [apiUrl, profile]);

    const handleSubmitTrainer = useCallback(async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('specialties', JSON.stringify(profile.specialties));
            formData.append('trainer_type', profile.trainer_type);
            formData.append('communication_email', profile.communication_email);
            formData.append('phone', profile.phone);

            const response = await axios.put(`${apiUrl}/user/profile/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile(prev => ({
                ...prev,
                specialties: response.data.trainer?.specialties || prev.specialties,
                trainer_type: response.data.trainer?.trainer_type || prev.trainer_type,
                communication_email: response.data.trainer?.communication_email || prev.communication_email,
                phone: response.data.trainer?.phone || prev.phone
            }));

            setSuccess('Perfil de entrenador actualizado correctamente');
            setIsEditingTrainer(false);
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            setError(`Error al actualizar el perfil de entrenador: ${error.response?.data?.detail || error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    }, [apiUrl, profile]);

    const handleSubmitMeasurements = useCallback(async (measurementData) => {
        try {
            console.log('Enviando medidas:', measurementData);
            
            // Enviar solo los datos de las medidas, el backend asignará el usuario automáticamente
            const response = await axios.post(`${apiUrl}/user/measurements/`, measurementData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Medidas guardadas:', response.data);
            
            // Actualizar las medidas locales directamente
            setMeasurements(prev => [...prev, response.data]);
            
            // Actualizar también el estado del usuario regular con los nuevos valores
            setRegularUser(prev => ({
                ...prev,
                ...measurementData
            }));
            
            setSuccess('Medidas guardadas correctamente');
            setIsEditingMeasurements(false);
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            console.error('Error al guardar medidas:', error.response?.data || error);
            setError(`Error al guardar las medidas: ${error.response?.data?.detail || error.response?.data?.message || error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    }, [apiUrl]);

    // Funciones para el análisis de progreso
    const handleMeasurementChange = useCallback((measurement) => {
        setSelectedMeasurements(prev => 
            prev.includes(measurement) 
                ? prev.filter(m => m !== measurement)
                : [...prev, measurement]
        );
    }, []);

    const handleTimeRangeChange = useCallback((e) => {
        setTimeRange(e.target.value);
    }, []);

    const handleChartTypeChange = useCallback((e) => {
        setChartType(e.target.value);
    }, []);

    // Renderizado condicional de componentes
    const renderTabContent = (tabKey) => {
        switch (tabKey) {
            case 'basic':
                return (
                    <BasicProfile
                        profile={profile}
                        onChange={handleProfileChange}
                        onSubmit={handleSubmitProfile}
                        isEditing={isEditingBasic}
                        onToggleEdit={() => setIsEditingBasic(!isEditingBasic)}
                    />
                );
            case 'trainer':
                if (role === 'trainer') {
                    return (
                        <TrainerProfile
                            profile={profile}
                            specialties={specialties}
                            onChange={handleSpecialtyChange}
                            onSubmit={handleSubmitTrainer}
                            isEditing={isEditingTrainer}
                            onToggleEdit={() => setIsEditingTrainer(!isEditingTrainer)}
                        />
                    );
                }
                return null;
            case 'measurements':
                if (role === 'regular_user') {
                    return (
                        <BodyMeasurements
                            measurements={regularUser}
                            onSubmit={handleSubmitMeasurements}
                            isEditing={isEditingMeasurements}
                            onToggleEdit={() => setIsEditingMeasurements(!isEditingMeasurements)}
                        />
                    );
                }
                return null;
            case 'progress':
                if (role === 'regular_user') {
                    return (
                        <ProgressAnalysis
                            measurements={measurements}
                            selectedMeasurements={selectedMeasurements}
                            timeRange={timeRange}
                            chartType={chartType}
                            onMeasurementChange={handleMeasurementChange}
                            onTimeRangeChange={handleTimeRangeChange}
                            onChartTypeChange={handleChartTypeChange}
                        />
                    );
                }
                return null;
            default:
                return null;
        }
    };

    const [activeTab, setActiveTab] = useState('basic');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Container className="profile-container">
            <div className="profile-header text-center mb-4">
                <h1 className="profile-title">
                    👤 Mi Perfil
                </h1>
                <p className="profile-subtitle">
                    Gestiona tu información personal y sigue tu progreso
                </p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            {/* Navegación de tabs personalizada */}
            <div className="profile-tabs mb-4">
                <div className="nav nav-tabs">
                    <button
                        className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                        onClick={() => handleTabChange('basic')}
                    >
                        👤 Básico
                    </button>
                    
                    {role === 'trainer' && (
                        <button
                            className={`nav-link ${activeTab === 'trainer' ? 'active' : ''}`}
                            onClick={() => handleTabChange('trainer')}
                        >
                            🏋️ Entrenador
                        </button>
                    )}
                    
                    {role === 'regular_user' && (
                        <button
                            className={`nav-link ${activeTab === 'measurements' ? 'active' : ''}`}
                            onClick={() => handleTabChange('measurements')}
                        >
                            📏 Medidas
                        </button>
                    )}
                    
                    {role === 'regular_user' && (
                        <button
                            className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                            onClick={() => handleTabChange('progress')}
                        >
                            📊 Progreso
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido de tabs */}
            <div className="tab-content">
                {renderTabContent(activeTab)}
            </div>
        </Container>
    );
};

export default Profile;
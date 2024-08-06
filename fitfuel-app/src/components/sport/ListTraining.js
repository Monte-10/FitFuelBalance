import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListTraining.css';

function ListTraining() {
    const [trainings, setTrainings] = useState([]);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/sport/trainings/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched trainings:', data);
            if (data.results && Array.isArray(data.results)) {
                setTrainings(data.results);
            } else {
                console.error('Trainings data is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching trainings:', error));
    }, [apiUrl]);

    const handleDeleteTraining = (trainingId, event) => {
        event.stopPropagation(); // Prevenir la navegación al hacer clic en Eliminar
        if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
            fetch(`${apiUrl}/sport/trainings/${trainingId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                },
            })
            .then(response => {
                if (response.ok) {
                    setTrainings(trainings.filter(training => training.id !== trainingId));
                } else {
                    console.error('Error al eliminar el entrenamiento');
                }
            })
            .catch(error => console.error('Error al eliminar el entrenamiento:', error));
        }
    };

    return (
        <div className="container-list-training mt-4">
            <h1 className="mb-4">Lista de Entrenamientos</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trainings.map(training => (
                        <tr key={training.id} onClick={() => navigate(`/sport/training/${training.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{training.name}</td>
                            <td>{training.date}</td>
                            <td>{training.user}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <Link to={`/sport/training/${training.id}`} className="btn btn-info me-2">Detalles</Link>
                                <Link to={`/sport/edit-training/${training.id}`} className="btn btn-success me-2">Editar</Link>
                                <button onClick={(e) => handleDeleteTraining(training.id, e)} className="btn btn-danger">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {trainings.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No se encontraron entrenamientos que coincidan con los criterios de búsqueda.
                </div>
            )}
        </div>
    );
}

export default ListTraining;

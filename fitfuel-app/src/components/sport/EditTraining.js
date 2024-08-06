import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditTraining.css';

function EditTraining() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [trainingName, setTrainingName] = useState('');
    const [trainingDate, setTrainingDate] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/sport/exercises/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
          })
            .then(response => response.json())
            .then(data => setExercises(data))
            .catch(error => console.error('Error:', error));

        fetch(`${apiUrl}/user/regularusers/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
          })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error al obtener usuarios:', error));

        // Cargar datos existentes del entrenamiento
        fetch(`${apiUrl}/sport/trainings/${id}/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
          })
            .then(response => response.json())
            .then(data => {
                setTrainingName(data.name);
                setTrainingDate(data.date);
                setSelectedUser(data.user);
                setSelectedExercises(data.exercises_details);
            })
            .catch(error => console.error('Error:', error));
    }, [id, apiUrl]);

    const handleAddExercise = () => {
        setSelectedExercises([...selectedExercises, { exerciseId: '', repetitions: '', sets: '', weight: '', time: null }]);
    };

    const handleChange = (index, field, value) => {
        const updatedExercises = [...selectedExercises];
        updatedExercises[index][field] = value;
        setSelectedExercises(updatedExercises);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const authToken = localStorage.getItem('authToken');

        const trainingData = {
            name: trainingName,
            date: trainingDate,
            user: selectedUser,
            exercises_details: selectedExercises.map(exercise => ({
                exercise_id: exercise.exerciseId,
                repetitions: exercise.repetitions,
                sets: exercise.sets,
                weight: exercise.weight,
                time: exercise.time || null // Use null for time if it's not set
            }))
        };

        fetch(`${apiUrl}/sport/trainings/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
            body: JSON.stringify(trainingData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error('Error al actualizar el entrenamiento: ' + JSON.stringify(errorData));
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Entrenamiento actualizado exitosamente!');
            navigate(`/sport/training/${id}`); // Redirect to the training details page
        })
        .catch((error) => {
            setError('Error al actualizar el entrenamiento');
            console.error('Error:', error);
        });
    };

    return (
        <div className="container-edit-training mt-4">
            <h2>Editar Entrenamiento</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="trainingName" className="form-label">Nombre del Entrenamiento:</label>
                    <input type="text" className="form-control" id="trainingName" value={trainingName} onChange={e => setTrainingName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="trainingDate" className="form-label">Fecha del Entrenamiento:</label>
                    <input type="date" className="form-control" id="trainingDate" value={trainingDate} onChange={e => setTrainingDate(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="userSelect" className="form-label">Usuario:</label>
                    <select className="form-select" id="userSelect" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                        <option value="">Selecciona un usuario</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                {selectedExercises.map((exercise, index) => (
                    <div key={index} className="mb-3">
                        <div className="input-group">
                            <select className="form-select" value={exercise.exerciseId} onChange={e => handleChange(index, 'exerciseId', e.target.value)} required>
                                <option value="">Selecciona un ejercicio</option>
                                {exercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                            <input type="number" className="form-control" placeholder="Repeticiones" value={exercise.repetitions} onChange={e => handleChange(index, 'repetitions', e.target.value)} required />
                            <input type="number" className="form-control" placeholder="Series" value={exercise.sets} onChange={e => handleChange(index, 'sets', e.target.value)} required />
                            <input type="text" className="form-control" placeholder="Peso (opcional)" value={exercise.weight} onChange={e => handleChange(index, 'weight', e.target.value)} />
                            <input type="number" className="form-control" placeholder="Tiempo en segundos (opcional)" value={exercise.time || ''} onChange={e => handleChange(index, 'time', e.target.value)} />
                        </div>
                    </div>
                ))}
                <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-3">
                    <button type="button" className="btn btn-outline-primary" onClick={handleAddExercise}>Añadir Ejercicio</button>
                    <button type="submit" className="btn btn-success">Guardar Entrenamiento</button>
                </div>
            </form>
        </div>
    );
}

export default EditTraining;

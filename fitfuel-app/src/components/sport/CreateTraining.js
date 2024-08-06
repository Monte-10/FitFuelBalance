import React, { useState, useEffect } from 'react';
import './CreateTraining.css';

function CreateTraining() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [trainingName, setTrainingName] = useState('');
  const [trainingDate, setTrainingDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUsersAndExercises = async () => {
      try {
        const exercisesResponse = await fetch(`${apiUrl}/sport/exercises/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        const usersResponse = await fetch(`${apiUrl}/user/regularusers/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });

        if (!exercisesResponse.ok || !usersResponse.ok) throw new Error('Error al obtener los datos');

        const exercisesData = await exercisesResponse.json();
        const usersData = await usersResponse.json();

        // Utiliza los arrays dentro de la propiedad `results`
        setExercises(exercisesData.results);
        setUsers(usersData.results);
      } catch (error) {
        setError('Error al obtener los datos. Por favor, intente nuevamente más tarde.');
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndExercises();
  }, [apiUrl]);

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
        time: exercise.time || null
      }))
    };

    try {
      const response = await fetch(`${apiUrl}/sport/trainings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Error al crear el entrenamiento: ' + JSON.stringify(errorData));
      }

      const data = await response.json();
      alert('Entrenamiento creado exitosamente!');
    } catch (error) {
      setError('Error al crear el entrenamiento');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container-create-training mt-5">
      <h2>Crear Entrenamiento</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="trainingName" className="form-label">Nombre del Entrenamiento:</label>
          <input type="text" className="form-control" id="trainingName" value={trainingName} onChange={(e) => setTrainingName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="trainingDate" className="form-label">Fecha del Entrenamiento:</label>
          <input type="date" className="form-control" id="trainingDate" value={trainingDate} onChange={(e) => setTrainingDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="userSelect" className="form-label">Usuario:</label>
          <select className="form-select" id="userSelect" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">Selecciona un usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        {selectedExercises.map((exercise, index) => (
          <div key={index} className="mb-3">
            <div className="input-group">
              <select className="form-select" value={exercise.exerciseId} onChange={(e) => handleChange(index, 'exerciseId', e.target.value)} required>
                <option value="">Selecciona un ejercicio</option>
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <input type="number" className="form-control" placeholder="Repeticiones" value={exercise.repetitions} onChange={(e) => handleChange(index, 'repetitions', e.target.value)} required />
              <input type="number" className="form-control" placeholder="Series" value={exercise.sets} onChange={(e) => handleChange(index, 'sets', e.target.value)} required />
              <input type="text" className="form-control" placeholder="Peso (opcional)" value={exercise.weight} onChange={(e) => handleChange(index, 'weight', e.target.value)} />
              <input type="number" className="form-control" placeholder="Tiempo en segundos (opcional)" value={exercise.time || ''} onChange={(e) => handleChange(index, 'time', e.target.value)} />
            </div>
          </div>
        ))}
        <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-3">
          <button type="button" className="btn btn-outline-secondary" onClick={handleAddExercise}>Añadir Ejercicio</button>
          <button type="submit" className="btn btn-success">Guardar Entrenamiento</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTraining;

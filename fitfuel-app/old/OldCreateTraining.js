import React, { useState, useEffect } from 'react';

function CreateTraining() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [trainingName, setTrainingName] = useState('');
  const [trainingDate, setTrainingDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('${apiUrl}/sport/exercises/')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error:', error));

    // Obtener lista de usuarios para asignar el entrenamiento
    fetch('${apiUrl}/user/regularusers/')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  const handleAddExercise = () => {
    setSelectedExercises([...selectedExercises, { exerciseId: '', repetitions: '', sets: '', weight: '', time: null }]);
  };

  const handleChange = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index][field] = value === '' && field === 'time' ? null : value;
    setSelectedExercises(updatedExercises);
  };

  const handleSetTime = (index, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index].time = value;
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
        time: exercise.time === '' ? null : exercise.time
      }))
    };

    fetch('${apiUrl}/sport/trainings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
      body: JSON.stringify(trainingData),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error('Error al crear el entrenamiento: ' + JSON.stringify(errorData));
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Entrenamiento creado exitosamente!');
    })
    .catch((error) => {
      setError('Error al crear el entrenamiento');
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h2>Crear Entrenamiento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre del Entrenamiento:
            <input type="text" value={trainingName} onChange={(e) => setTrainingName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Fecha del Entrenamiento:
            <input type="date" value={trainingDate} onChange={(e) => setTrainingDate(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Usuario:
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Selecciona un usuario</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </label>
        </div>
        {selectedExercises.map((exercise, index) => (
          <div key={index}>
            <select value={exercise.exerciseId} onChange={(e) => handleChange(index, 'exerciseId', e.target.value)}>
              <option value="">Selecciona un ejercicio</option>
              {exercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Repeticiones" value={exercise.repetitions} onChange={(e) => handleChange(index, 'repetitions', e.target.value)} />
            <input type="number" placeholder="Series" value={exercise.sets} onChange={(e) => handleChange(index, 'sets', e.target.value)} />
            <input type="text" placeholder="Peso (opcional)" value={exercise.weight} onChange={(e) => handleChange(index, 'weight', e.target.value)} />
            <input type="number" placeholder="Tiempo en segundos (opcional)" value={exercise.time === null ? '' : exercise.time} onChange={(e) => handleChange(index, 'time', e.target.value)} />
            {exercise.time === null ? (
              <button type="button" onClick={() => handleSetTime(index, 0)}>Añadir Tiempo</button>
            ) : (
              <button type="button" onClick={() => handleSetTime(index, null)}>Quitar Tiempo</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddExercise}>Añadir Ejercicio</button>
        <button type="submit">Guardar Entrenamiento</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreateTraining;

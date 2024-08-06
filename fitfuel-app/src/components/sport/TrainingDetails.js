import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TrainingDetails.css';

function TrainingDetails() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/sport/trainings/${id}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to fetch training details');
    })
    .then(data => {
      setTraining(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Failed to load training details');
      setLoading(false);
    });
  }, [id, apiUrl]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-training-details mt-4">
      <h1 className="mb-4">Detalles del Entrenamiento</h1>
      {training ? (
        <div className="card p-4">
          <h2>{training.name}</h2>
          <p><strong>Fecha:</strong> {training.date}</p>
          <p><strong>Usuario:</strong> {training.user.username}</p>
          <h3 className="mt-4">Ejercicios</h3>
          <ul className="list-group">
            {training.exercises_details.map((ex, index) => (
              <li key={index} className="list-group-item">
                <strong>{ex.exercise.name}</strong> - Repeticiones: {ex.repetitions}, Series: {ex.sets}, Peso: {ex.weight || 'N/A'}, Tiempo: {ex.time || 'N/A'}
              </li>
            ))}
          </ul>
          <Link to="/sport/trainings" className="btn btn-success mt-4">Volver a la lista de entrenamientos</Link>
        </div>
      ) : (
        <p>No se encontró el entrenamiento.</p>
      )}
    </div>
  );
}

export default TrainingDetails;

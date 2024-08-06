import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ExerciseDetails() {
  const { id } = useParams(); // Usar useParams para obtener el ID del ejercicio
  const [exercise, setExercise] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/sport/edit-exercise/${id}`); // Redirigir al usuario a la pantalla de edición del ejercicio
  }

  useEffect(() => {
    fetch(`${apiUrl}/sport/exercises/${id}/`) // Usar el ID del ejercicio para la petición
      .then(response => response.json())
      .then(data => {
        setExercise(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]); // Dependencia de useEffect basada en el ID para recargar cuando cambie

  if (!exercise) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>{exercise.name}</h1>
      <p>{exercise.description}</p>
      <p>Tipo: {exercise.type}</p>
      {exercise.image && (
        <div>
          <h3>Imagen</h3>
          <img src={exercise.image} alt={exercise.name} style={{ maxWidth: '500px' }} />
        </div>
      )}
      {exercise.video_url && (
        <div>
          <h3>Video</h3>
          <iframe
            src={exercise.video_url.replace("watch?v=", "embed/")}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={exercise.name}
            style={{ maxWidth: '500px', height: '300px' }}
          ></iframe>
        </div>
      )}
      <button onClick={handleEdit}>Editar Ejercicio</button>
    </div>
  );
}

export default ExerciseDetails;

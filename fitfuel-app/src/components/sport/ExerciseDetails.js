import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExerciseDetails.css';

function ExerciseDetails() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/sport/exercises/${id}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => setExercise(data))
      .catch(error => console.error('Error:', error));
  }, [id, apiUrl]);

  const handleEdit = () => {
    navigate(`/sport/edit-exercise/${id}`);
  }

  if (!exercise) {
    return <div className="container text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  return (
    <div className="container-exercise-details mt-4">
      <h1 className="mb-3">{exercise.name}</h1>
      <p>{exercise.description}</p>
      <p><strong>Type:</strong> {exercise.type}</p>
      {exercise.image && (
        <div className="mb-3">
          <h3>Image</h3>
          <img src={exercise.image} alt={exercise.name} className="img-fluid" />
        </div>
      )}
      {exercise.video_url && (
        <div className="mb-3">
          <h3>Video</h3>
          <div className="ratio ratio-16x9">
            <iframe
              src={exercise.video_url.replace("watch?v=", "embed/")}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={exercise.name}
            ></iframe>
          </div>
        </div>
      )}
      <button onClick={handleEdit} className="btn btn-success">Edit Exercise</button>
    </div>
  );
}

export default ExerciseDetails;

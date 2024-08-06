import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditExercise.css';

function EditExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Cargar los datos existentes del ejercicio
    fetch(`${apiUrl}/sport/exercises/${id}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setName(data.name);
        setDescription(data.description);
        setType(data.type);
        setVideoUrl(data.video_url);
      })
      .catch(error => console.error('Error:', error));
  }, [id, apiUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    if (image) formData.append('image', image);
    formData.append('video_url', videoUrl);

    fetch(`${apiUrl}/sport/exercises/${id}/`, {
      method: 'PUT', // or PATCH depending on your API
      body: formData,
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      if (response.ok) {
        navigate(`/sport/exercise/${id}`); // Redirect the user to the updated exercise details
      } else {
        throw new Error('Error updating the exercise');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div className="container-edit-exercise mt-4">
      <h2>Editar Ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exerciseName" className="form-label">Nombre del Ejercicio:</label>
          <input
            type="text"
            className="form-control"
            id="exerciseName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exerciseDescription" className="form-label">Descripción:</label>
          <textarea
            className="form-control"
            id="exerciseDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exerciseType" className="form-label">Tipo:</label>
          <select className="form-select" id="exerciseType" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Seleccione un tipo</option>
            <option value="FUERZA">Fuerza</option>
            <option value="CARDIO">Cardio</option>
            <option value="FLEXIBILIDAD">Flexibilidad</option>
            <option value="BALANCE">Balance</option>
            <option value="RESISTENCIA">Resistencia</option>
            <option value="HIIT">HIIT</option>
            <option value="FUNCIONAL">Funcional</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="exerciseImage" className="form-label">Imagen (opcional):</label>
          <input
            type="file"
            className="form-control"
            id="exerciseImage"
            onChange={handleImageChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="videoUrl" className="form-label">URL del Video (opcional):</label>
          <input
            type="text"
            className="form-control"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Actualizar Ejercicio</button>
      </form>
    </div>
  );
}

export default EditExercise;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Cargar los datos existentes del ejercicio
    fetch(`${apiUrl}/sport/exercises/${id}/`)
      .then(response => response.json())
      .then(data => {
        setName(data.name);
        setDescription(data.description);
        setType(data.type);
        setVideoUrl(data.video_url);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('video_url', videoUrl);
    if (image) formData.append('image', image);

    fetch(`${apiUrl}/sport/exercises/${id}/`, {
      method: 'PUT', // o PATCH dependiendo de cómo tu API maneje las actualizaciones
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        navigate(`/sport/exercise/${id}`); // Redirigir al usuario a los detalles del ejercicio actualizado
      } else {
        throw new Error('Error al actualizar el ejercicio');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div>
      <h2>Editar Ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre del Ejercicio:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Descripción:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Tipo:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Seleccione un tipo</option>
            <option value="FUERZA">Fuerza</option>
            <option value="CARDIO">Cardio</option>
            <option value="FLEXIBILIDAD">Flexibilidad</option>
            <option value="BALANCE">Balance</option>
            <option value="RESISTENCIA">Resistencia</option>
            <option value="HIIT">HIIT</option>
            <option value="FUNCIONAL">Funcional</option>
          </select>
        </label>
        <label>
          Imagen (opcional):
          <input
            type="file"
            onChange={handleImageChange}
          />
        </label>
        <label>
          URL del Video (opcional):
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </label>
        <button type="submit">Actualizar Ejercicio</button>
      </form>
    </div>
  );
}

export default EditExercise;

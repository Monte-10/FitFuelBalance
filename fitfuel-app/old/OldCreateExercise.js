import React, { useState } from 'react';

function CreateExercise() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null); // Para manejar la imagen
  const [videoUrl, setVideoUrl] = useState(''); // Estado para manejar la URL del video
  const [exerciseCreated, setExerciseCreated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(); // Usar FormData para manejar archivos de imagen y datos
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    if (image) formData.append('image', image, image.name);
    formData.append('video_url', videoUrl); // Añade la URL del video al FormData

    console.log("Sending exercise data");

    fetch('${apiUrl}/sport/exercises/', {
      method: 'POST',
      body: formData, // No se establecen headers porque FormData establece el 'Content-Type' automáticamente
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setExerciseCreated(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Asumiendo que solo se sube una imagen
  };

  return (
    <div>
      {exerciseCreated ? (
        <div>
          <p>El ejercicio se ha creado correctamente.</p>
          <button onClick={() => setExerciseCreated(false)}>Crear otro Ejercicio</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del Ejercicio:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Descripción:
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <label>
            Tipo:
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="">Seleccione un tipo</option>
              {/* Tipos de ejercicio */}
              <option value="FUERZA">Fuerza</option>
              <option value="CARDIO">Cardio</option>
              <option value="FLEXIBILIDAD">Flexibilidad</option>
              <option value="BALANCE">Balance</option>
              <option value="RESISTENCIA">Resistencia</option>
              <option value="HIIT">HIIT</option>
              <option value="FUNCIONAL">Funcional</option>
              {/* etc. */}
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
          <button type="submit">Crear Ejercicio</button>
        </form>
      )}
    </div>
  );
}

export default CreateExercise;

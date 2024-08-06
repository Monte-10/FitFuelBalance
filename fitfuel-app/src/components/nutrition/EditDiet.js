import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditDiet.css';

function EditDiet() {
  const { dietId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [loadingError, setLoadingError] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/nutrition/diet/${dietId}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch diet details');
        }
        return response.json();
      })
      .then(data => {
        setName(data.name);
        if (data.user && data.user.id) {
          setSelectedUser(data.user.id.toString());
        } else {
          setSelectedUser('');
        }
        setStartDate(data.start_date);
        setEndDate(data.end_date);
      })
      .catch(error => {
        console.error('Error fetching diet details:', error);
        setLoadingError(true);
      });

    fetch(`${apiUrl}/user/regularusers/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => setUsers(data));
  }, [dietId, apiUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dietData = {
      name,
      user: selectedUser,
      start_date: startDate,
      end_date: endDate,
    };

    fetch(`${apiUrl}/nutrition/diet/${dietId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(dietData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update diet');
      }
      return response.json();
    })
    .then(data => {
      navigate(`/nutrition/edit-dailydiet/${dietId}`); // Asegúrate de que esta es la URL correcta
    })
    .catch(error => {
      console.error('Error updating diet:', error);
    });
  };

  if (loadingError) {
    return <div>Error loading diet details. Please try again later.</div>;
  }

  return (
    <div className="container-editdiet mt-5">
      <h2 className="mb-4">Editar Dieta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre de la Dieta:</label>
          <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="userSelect" className="form-label">Usuario:</label>
          <select className="form-select" id="userSelect" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
            <option value="">Seleccione un usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Fecha de Inicio:</label>
          <input type="date" className="form-control" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">Fecha de Fin:</label>
          <input type="date" className="form-control" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Dieta</button>
      </form>
    </div>
  );
}

export default EditDiet;

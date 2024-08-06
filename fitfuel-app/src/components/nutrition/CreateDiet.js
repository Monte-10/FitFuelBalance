import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateDiet.css';

function CreateDiet() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/user/regularusers/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.results)) {
          setUsers(data.results);
          if (data.results.length > 0) {
            setSelectedUser(data.results[0].id.toString());
          }
        } else {
          setUsers([]);
        }
      });
  }, [apiUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dietData = {
      name,
      user: selectedUser,
      start_date: startDate,
      end_date: endDate,
    };

    console.log("Sending diet data", dietData);
    fetch(`${apiUrl}/nutrition/diet/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(dietData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        return response.json();
      })
      .then(data => {
        console.log('Redirecting to:', `nutrition/edit-dailydiet/${data.id}`)
        navigate(`/nutrition/edit-dailydiet/${data.id}`);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="create-diet-container mt-5">
      <h2 className="mb-4">Crear Nueva Dieta</h2>
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
        <button type="submit" className="btn btn-primary">Crear Dieta</button>
      </form>
    </div>
  );
}

export default CreateDiet;

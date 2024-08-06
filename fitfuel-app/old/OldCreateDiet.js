import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateDiet() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [newDietId, setNewDietId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('${apiUrl}/user/regularusers/')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0].id.toString());
        }
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dietData = {
      name,
      user: selectedUser,
      start_date: startDate,
      end_date: endDate,
    };
    console.log("Sending diet data", dietData);
    fetch('${apiUrl}/nutrition/diet/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dietData),
        })
        .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
            throw new Error(`Error: ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
        })
        .then(data => {
        setNewDietId(data.id);
        setRedirect(true);
        })
        .catch(error => {
        console.error('Error:', error.message);
    });
  };

  if (redirect) {
    navigate(`/edit-dailydiet/${newDietId}`);
  }

  return (
    <div>
      <h2>Crear Nueva Dieta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la Dieta:
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Usuario:
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="">Seleccione un usuario</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>Fecha de Inicio:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Fecha de Fin:
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>
        </div>
        <button type="submit">Crear Dieta</button>
      </form>
    </div>
  );
}

export default CreateDiet;

import React, { useState, useEffect } from 'react';
import MealTable from './MealTable';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlan.css';

const CreatePlan = () => {
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [planCreated, setPlanCreated] = useState(false);
  const [planId, setPlanId] = useState(null);
  const [users, setUsers] = useState([]);  // Inicializa como un array vacío
  const [selectedUser, setSelectedUser] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch users when the component is mounted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/regularusers/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        const data = await response.json();
        setUsers(data.results || []);  // Asegúrate de que sea un array
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [apiUrl]);

  const handleSubmit = () => {
    const planData = {
      name: planName,
      start_date: startDate,
      end_date: endDate,
      user: selectedUser,  // Agrega el usuario seleccionado al payload
    };

    fetch(`${apiUrl}/nutrition/plans/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(planData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.id) {
        toast.success('Plan created successfully!');
        setPlanCreated(true);
        setPlanId(data.id);  // Guarda el ID del plan creado
      } else {
        toast.error('Error creating plan');
      }
    })
    .catch(error => {
      console.error('Error creating plan:', error);
      toast.error('Error creating plan');
    });
  };

  return (
    <div className="container mt-4 create-plan-container">
      <h2>Create Plan</h2>
      <ToastContainer />

      {!planCreated ? (
        <>
          {/* Formulario de creación del plan */}
          <div className="form-group mb-3">
            <label htmlFor="planName">Plan Name:</label>
            <input
              type="text"
              className="form-control"
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Selección de usuario */}
          <div className="form-group mb-3">
            <label htmlFor="userSelect">Assign to User:</label>
            <select
              id="userSelect"
              className="form-control"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {Array.isArray(users) && users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSubmit} className="btn btn-primary">Create Plan</button>
        </>
      ) : (
        <>
          <h2>Plan Created: {planName}</h2>
          <MealTable planId={planId} />  {/* Renderizamos la tabla con el ID del plan */}
        </>
      )}
    </div>
  );
};

export default CreatePlan;

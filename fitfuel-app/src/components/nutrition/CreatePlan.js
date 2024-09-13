import React, { useState } from 'react';
import MealTable from './MealTable';  // Importa el componente de la tabla
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlan.css';

const CreatePlan = () => {
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [planCreated, setPlanCreated] = useState(false);
  const [planId, setPlanId] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = () => {
    const planData = {
      name: planName,
      start_date: startDate,
      end_date: endDate,
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
      toast.success('Plan created successfully!');
      setPlanCreated(true);
      setPlanId(data.id);  // Guardamos el ID del plan creado
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

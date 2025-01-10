import React, { useState, useEffect } from 'react';
import MealTable from './MealTable';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlan.css';

const CreatePlan = ({ isEditMode = false }) => {
  const { id: planIdParam } = useParams(); // planId en modo edición
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [planCreated, setPlanCreated] = useState(false);
  const [planId, setPlanId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  // Al montar:
  //  - Carga la lista de usuarios
  //  - Si isEditMode, también carga los datos del plan
  useEffect(() => {
    fetchUsers();
    if (isEditMode && planIdParam) {
      fetchPlanData(planIdParam);
    }
  }, [isEditMode, planIdParam]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/regularusers/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.results || []);
      } else {
        toast.error('Error fetching users.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users.');
    }
  };

  // Sólo se usa en modo edición
  const fetchPlanData = async (planId) => {
    try {
      const response = await fetch(`${apiUrl}/nutrition/plans/${planId}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Plan no encontrado o error al cargarlo.');
      }
      const data = await response.json();
      // Rellenar campos
      setPlanName(data.name);
      setStartDate(data.start_date);
      setEndDate(data.end_date);
      setSelectedUser(data.user);

      // Dejar listo para mostrar la tabla
      setPlanId(data.id);
      setPlanCreated(true);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      toast.error('Error fetching plan data.');
    }
  };

  const validateDates = () => {
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date.');
      return false;
    }
    if (!startDate || !endDate) {
      toast.error('Please provide both start and end dates.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!planName) {
      toast.error('Plan name is required.');
      return;
    }
    if (!selectedUser) {
      toast.error('Please select a user.');
      return;
    }
    if (!validateDates()) return;

    const planData = {
      name: planName,
      start_date: startDate,
      end_date: endDate,
      user: selectedUser,
    };

    try {
      let response;
      let data;

      if (!isEditMode) {
        // Crear Plan (POST)
        response = await fetch(`${apiUrl}/nutrition/plans/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(planData)
        });
        data = await response.json();
        if (response.ok && data.id) {
          toast.success('Plan created successfully!');
          setPlanCreated(true);
          setPlanId(data.id);
        } else {
          toast.error(data.detail || 'Error creating plan.');
        }
      } else {
        // Editar Plan (PUT)
        response = await fetch(`${apiUrl}/nutrition/plans/${planIdParam}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(planData)
        });
        data = await response.json();
        if (response.ok && data.id) {
          toast.success('Plan updated successfully!');
          setPlanCreated(true);
          setPlanId(data.id);
        } else {
          toast.error(data.detail || 'Error updating plan.');
        }
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Error saving plan.');
    }
  };

  return (
    <div className="container mt-4 create-plan-container">
      <h2>{isEditMode ? 'Edit Plan' : 'Create Plan'}</h2>
      <ToastContainer />

      {/* Si el plan aún no está creado, muestra el formulario de crear/editar */}
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

          <div className="form-group mb-3">
            <label htmlFor="userSelect">Assign to User:</label>
            <select
              id="userSelect"
              className="form-control"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSubmit} className="btn btn-primary">
            {isEditMode ? 'Update Plan' : 'Create Plan'}
          </button>
        </>
      ) : (
        <>
          {/* Si el plan YA está creado (o cargado en edición), mostramos la MealTable */}
          <h2>Plan: {planName}</h2>
          <MealTable
            planId={planId}
            planName={planName}
            startDate={startDate}
            endDate={endDate}
            selectedUser={selectedUser}
          />
        </>
      )}
    </div>
  );
};

export default CreatePlan;

import React, { useState, useEffect, useCallback } from 'react';
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

  // Estado para almacenar la "versión cruda" de ingredientes (day, meal, ingredient, quantity, etc.)
  const [existingIngredients, setExistingIngredients] = useState([]);

  // Añade un estado para los ingredientes seleccionados en MealTable
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  // -----------
  // Evitar warning por missing deps: definimos los fetch con useCallback
  // -----------
  const fetchUsers = useCallback(async () => {
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
  }, [apiUrl]);

  const fetchPlanData = useCallback(async (planId) => {
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
      setPlanId(data.id);

      // Convertimos custom_meals -> existingIngredients
      if (data.custom_meals) {
        const parsedIngredients = [];
        data.custom_meals.forEach((cm) => {
          if (cm.ingredients) {
            cm.ingredients.forEach((ing) => {
              parsedIngredients.push({
                day: cm.day,
                meal: cm.meal_type,
                id: ing.ingredient,
                name: ing.name,
                quantity: ing.quantity,
                unit_based: ing.unit_based,
                calories: ing.calories,
                protein: ing.protein,
                fat: ing.fat,
                saturated_fat: ing.saturated_fat,
                carbohydrates: ing.carbohydrates,
                sugar: ing.sugar,
              });
            });
          }
        });
        setExistingIngredients(parsedIngredients);
      }

      setPlanCreated(true);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      toast.error('Error fetching plan data.');
    }
  }, [apiUrl]);

  // Llamamos a fetchUsers y fetchPlanData cuando sea necesario
  useEffect(() => {
    fetchUsers();
    if (isEditMode && planIdParam) {
      fetchPlanData(planIdParam);
    }
  }, [isEditMode, planIdParam, fetchUsers, fetchPlanData]);

  // --------------------

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
      ingredients: selectedIngredients.length > 0 ? selectedIngredients : existingIngredients,
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
          <h2>Plan: {planName}</h2>
          {/* Ahora que tenemos un plan con ID, y existingIngredients (si en edit), 
              mostramos MealTable */}
          <MealTable
            planId={planId}
            planName={planName}
            startDate={startDate}
            endDate={endDate}
            selectedUser={selectedUser}
            existingIngredients={existingIngredients}
            onIngredientsChange={setSelectedIngredients}
          />
        </>
      )}
    </div>
  );
};

export default CreatePlan;

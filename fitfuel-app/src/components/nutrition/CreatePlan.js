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
      {isEditMode && planCreated ? (
        <>
          <div className="edit-plan-header-box">
            <h2 className="edit-plan-title">Editar Plan</h2>
            <div className="edit-plan-name">{planName}</div>
          </div>
          <div className="assign-user-box">
            <label htmlFor="userSelect" className="assign-user-label">Asignar a Usuario:</label>
            <select
              id="userSelect"
              className="assign-user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <div className="create-plan-header">
          <h2 className="create-plan-title">
            {isEditMode ? '✏️ Editar Plan' : '📋 Crear Nuevo Plan'}
          </h2>
          <p className="create-plan-subtitle">
            {isEditMode ? 'Modifica los detalles del plan existente' : 'Crea un nuevo plan de nutrición personalizado'}
          </p>
        </div>
      )}
      
      <ToastContainer />

      {!planCreated ? (
        <div className="create-plan-form">
          <div className="form-section">
            <h3 className="form-section-title">📝 Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="planName" className="form-label">
                <span className="label-icon">🏷️</span>
                Nombre del Plan
              </label>
              <input
                type="text"
                className="form-control"
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Ej: Plan de Verano, Dieta de Mantenimiento..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  <span className="label-icon">📅</span>
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  <span className="label-icon">📅</span>
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="userSelect" className="form-label">
                <span className="label-icon">👤</span>
                Usuario Asignado
              </label>
              <select
                id="userSelect"
                className="form-control"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">Selecciona un usuario para asignar este plan</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    👤 {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit} className="btn btn-primary btn-create-plan">
              <span className="btn-icon">
                {isEditMode ? '💾' : '🚀'}
              </span>
              {isEditMode ? 'Actualizar Plan' : 'Crear Plan'}
            </button>
          </div>
        </div>
      ) : (
        <>
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

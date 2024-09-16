import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MealTable = ({ planId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [nutritionTotals, setNutritionTotals] = useState({});
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch users to assign the plan
  useEffect(() => {
    fetch(`${apiUrl}/user/regularusers/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.results));
  }, [apiUrl]);

  // Abrir el modal de ingredientes
  const openModal = (day, meal) => {
    setShowModal({ day, meal });
  };

  // Agregar ingrediente seleccionado al día/meal correspondiente
  const handleIngredientSelect = (ingredient) => {
    const { day, meal } = showModal;
    setSelectedIngredients((prev) => {
      const dayIngredients = prev[day] || {};
      const mealIngredients = dayIngredients[meal] || [];
      return {
        ...prev,
        [day]: {
          ...dayIngredients,
          [meal]: [...mealIngredients, { ...ingredient, quantity: 100 }]
        }
      };
    });
    setShowModal(false);
  };

  // Eliminar ingrediente
  const removeIngredient = (day, meal, ingredientId) => {
    setSelectedIngredients((prev) => {
      const dayIngredients = prev[day] || {};
      const mealIngredients = dayIngredients[meal] || [];
      const filteredIngredients = mealIngredients.filter(ing => ing.id !== ingredientId);
      return {
        ...prev,
        [day]: {
          ...dayIngredients,
          [meal]: filteredIngredients
        }
      };
    });
  };

  // Calcular totales nutricionales por día
  useEffect(() => {
    const totals = {};
    Object.keys(selectedIngredients).forEach((day) => {
      const dayTotals = { calories: 0, fat: 0, saturated_fat: 0, protein: 0, carbohydrates: 0, sugar: 0 };
      Object.values(selectedIngredients[day]).forEach((meal) => {
        meal.forEach((ingredient) => {
          dayTotals.calories += ingredient.calories * (ingredient.quantity / 100);
          dayTotals.fat += ingredient.fat * (ingredient.quantity / 100);
          dayTotals.saturated_fat += ingredient.saturated_fat * (ingredient.quantity / 100);
          dayTotals.protein += ingredient.protein * (ingredient.quantity / 100);
          dayTotals.carbohydrates += ingredient.carbohydrates * (ingredient.quantity / 100);
          dayTotals.sugar += ingredient.sugar * (ingredient.quantity / 100);
        });
      });
      totals[day] = dayTotals;
    });
    setNutritionTotals(totals);
  }, [selectedIngredients]);

  // Guardar el plan asignado a un usuario
  const handleSavePlan = () => {
    const planData = {
      plan_id: planId,
      user: selectedUser,
      meals: selectedIngredients,
    };

    fetch(`${apiUrl}/nutrition/saveplan/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(planData)
    })
    .then((response) => {
      if (response.ok) {
        toast.success("Plan asignado al usuario con éxito.");
      } else {
        toast.error("Error al asignar el plan.");
      }
    })
    .catch(() => toast.error("Error al asignar el plan."));
  };

  return (
    <div className="meal-table-container">
      <ToastContainer />
      <div className="mb-3">
        <label htmlFor="userSelect">Seleccionar Usuario para asignar el plan:</label>
        <select
          className="form-control"
          id="userSelect"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Día</th>
            <th>Desayuno</th>
            <th>Almuerzo</th>
            <th>Cena</th>
            <th>Extras</th>
          </tr>
        </thead>
        <tbody>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {['Desayuno', 'Almuerzo', 'Cena', 'Extras'].map((meal) => (
                <td key={meal}>
                  <button onClick={() => openModal(day, meal)} className="btn btn-success btn-block mb-2">
                    + Añadir Ingrediente
                  </button>

                  {/* Mostrar ingredientes seleccionados */}
                  {selectedIngredients[day] && selectedIngredients[day][meal] && (
                    <ul className="ingredient-list">
                      {selectedIngredients[day][meal].map((ingredient) => (
                        <li key={ingredient.id} className="ingredient-item">
                          {ingredient.name} ({ingredient.quantity}g)
                          <button
                            onClick={() => removeIngredient(day, meal, ingredient.id)}
                            className="btn btn-danger btn-sm ml-2"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales Nutricionales por día */}
      <div className="nutrition-totals">
        {Object.keys(nutritionTotals).map((day) => (
          <div key={day}>
            <h4>Totales Nutricionales para {day}</h4>
            <ul>
              <li>Calorías: {nutritionTotals[day].calories.toFixed(2)}</li>
              <li>Grasas: {nutritionTotals[day].fat.toFixed(2)}g</li>
              <li>Grasas Saturadas: {nutritionTotals[day].saturated_fat.toFixed(2)}g</li>
              <li>Proteínas: {nutritionTotals[day].protein.toFixed(2)}g</li>
              <li>Carbohidratos: {nutritionTotals[day].carbohydrates.toFixed(2)}g</li>
              <li>Azúcares: {nutritionTotals[day].sugar.toFixed(2)}g</li>
            </ul>
          </div>
        ))}
      </div>

      <button onClick={handleSavePlan} className="btn btn-primary mt-4">
        Guardar y Asignar Plan
      </button>

      {/* Modal para seleccionar ingredientes */}
      {showModal && (
        <IngredientModal
          show={!!showModal}
          onClose={() => setShowModal(false)}
          onIngredientSelect={handleIngredientSelect}
        />
      )}
    </div>
  );
};

export default MealTable;

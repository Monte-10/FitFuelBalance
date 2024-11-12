import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';

const MealTable = ({ planId, planName, startDate, endDate, selectedUser }) => {
  const [showModal, setShowModal] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [nutritionTotals, setNutritionTotals] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(selectedUser || '');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/regularusers/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        const data = await response.json();
        setUsers(data.results || []);
        if (data.results.length > 0) {
          setSelectedUserId(data.results[0].id);  // Set the first user as default
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [apiUrl]);

  const openModal = (day, meal) => {
    setShowModal({ day, meal });
  };

  const handleIngredientSelect = (ingredient) => {
    const { day, meal } = showModal;
    setSelectedIngredients((prev) => {
      const dayIngredients = prev[day] || {};
      const mealIngredients = dayIngredients[meal] || [];

      const existingIngredient = mealIngredients.find((ing) => ing.id === ingredient.id);
      if (existingIngredient) {
        existingIngredient.quantity += 100;
      } else {
        mealIngredients.push({ ...ingredient, quantity: 100 });
      }

      return {
        ...prev,
        [day]: {
          ...dayIngredients,
          [meal]: mealIngredients,
        },
      };
    });
    setShowModal(null);
  };

  const removeIngredient = (day, meal, ingredientId) => {
    setSelectedIngredients((prev) => {
      const dayIngredients = prev[day] || {};
      const mealIngredients = dayIngredients[meal] || [];
      const filteredIngredients = mealIngredients.filter((ing) => ing.id !== ingredientId);

      return {
        ...prev,
        [day]: {
          ...dayIngredients,
          [meal]: filteredIngredients,
        },
      };
    });
  };

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

  const savePlan = async () => {
    const ingredientsList = [];
    Object.keys(selectedIngredients).forEach((day) => {
      const meals = selectedIngredients[day];
      Object.keys(meals).forEach((meal) => {
        meals[meal].forEach((ingredient) => {
          ingredientsList.push({
            day,
            meal,
            ingredient: ingredient.id,
            quantity: ingredient.quantity,
          });
        });
      });
    });

    const payload = {
      name: planName,
      start_date: startDate,
      end_date: endDate,
      user: selectedUserId,
      ingredients: ingredientsList,
    };

    console.log('Payload enviado:', payload);

    try {
      const response = await fetch(`${apiUrl}/nutrition/plans/${planId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error saving plan');
      }

      const data = await response.json();
      console.log('Plan saved successfully:', data);
      alert('Plan saved successfully!');
    } catch (error) {
      console.error('Error saving plan:', error);
      alert(`Error saving plan: ${error.message}`);
    }
  };

  return (
    <div className="meal-table-container">
      <div className="form-group">
        <label htmlFor="userSelect">Asignar a Usuario:</label>
        <select
          id="userSelect"
          className="form-control"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
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

      <h3>Totales Nutricionales</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Día</th>
            <th>Calorías</th>
            <th>Grasas</th>
            <th>Grasas Saturadas</th>
            <th>Proteínas</th>
            <th>Carbohidratos</th>
            <th>Azúcares</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(nutritionTotals).map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>{nutritionTotals[day].calories.toFixed(2)}</td>
              <td>{nutritionTotals[day].fat.toFixed(2)}g</td>
              <td>{nutritionTotals[day].saturated_fat.toFixed(2)}g</td>
              <td>{nutritionTotals[day].protein.toFixed(2)}g</td>
              <td>{nutritionTotals[day].carbohydrates.toFixed(2)}g</td>
              <td>{nutritionTotals[day].sugar.toFixed(2)}g</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={savePlan} className="btn btn-primary">Guardar y Asignar Plan</button>

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

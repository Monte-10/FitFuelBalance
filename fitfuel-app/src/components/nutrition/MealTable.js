import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';

const MealTable = ({
  planId,
  planName,
  startDate,
  endDate,
  selectedUser,
  existingIngredients = []
}) => {
  const [showModal, setShowModal] = useState(null);

  // Estructura interna:
  // selectedIngredients: {
  //   Monday: {
  //     Desayuno: [ { id, quantity, etc. }, ...],
  //     Almuerzo: [...],
  //     ...
  //   },
  //   ...
  // }
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [nutritionTotals, setNutritionTotals] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(selectedUser || '');

  const apiUrl = process.env.REACT_APP_API_URL;

  // Cargar la lista de usuarios (opcional, si lo usas para reasignar)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/regularusers/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        const data = await response.json();
        setUsers(data.results || []);
        if (data.results?.length > 0) {
          setSelectedUserId(data.results[0].id);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [apiUrl]);

  // Al montar o cambiar existingIngredients, parseamos
  useEffect(() => {
    if (existingIngredients.length > 0) {
      const parsed = parseIngredientsToSelected(existingIngredients);
      setSelectedIngredients(parsed);
    } 
    else {
      // Si no hay existingIngredients, asegúrate de setear un objeto vacío
      setSelectedIngredients({});
    }
  }, [existingIngredients]);

  // Transforma el array [ { day, meal, id, quantity, ... }, ... ]
  // a { day: { meal: [ { id, quantity }, ... ] } }
  const parseIngredientsToSelected = (ingredientsArray) => {
    const result = {};
    ingredientsArray.forEach((item) => {
      const { day, meal, ...rest } = item;
      if (!result[day]) {
        result[day] = {};
      }
      if (!result[day][meal]) {
        result[day][meal] = [];
      }
      // rest contendrá { id, quantity, etc. }
      result[day][meal].push(rest);
    });
    return result;
  };

  // Abre el modal para elegir ingrediente
  const openModal = (day, meal) => {
    setShowModal({ day, meal });
  };

  // Maneja la selección de un ingrediente en el modal
  const handleIngredientSelect = (ingredient) => {
    const { day, meal } = showModal;
    setSelectedIngredients((prev) => {
      const dayMeals = prev[day] || {};
      const mealArray = dayMeals[meal] || [];

      const existing = mealArray.find((ing) => ing.id === ingredient.id);
      if (existing) {
        existing.quantity += 100;
      } else {
        mealArray.push({ ...ingredient, quantity: 100 });
      }

      return {
        ...prev,
        [day]: {
          ...dayMeals,
          [meal]: mealArray
        }
      };
    });
    setShowModal(null);
  };

  // Eliminar ingrediente
  const removeIngredient = (day, meal, ingredientId) => {
    setSelectedIngredients((prev) => {
      const dayMeals = prev[day] || {};
      const mealArray = dayMeals[meal] || [];
      const filtered = mealArray.filter((ing) => ing.id !== ingredientId);

      return {
        ...prev,
        [day]: {
          ...dayMeals,
          [meal]: filtered
        }
      };
    });
  };

  // Calcular totales
  useEffect(() => {
    const totals = {};
    Object.keys(selectedIngredients).forEach((day) => {
      const dayTotals = { calories: 0, fat: 0, saturated_fat: 0, protein: 0, carbohydrates: 0, sugar: 0 };

      Object.values(selectedIngredients[day]).forEach((mealArray) => {
        mealArray.forEach((ingredient) => {
          dayTotals.calories += (ingredient.calories || 0) * (ingredient.quantity / 100);
          dayTotals.fat += (ingredient.fat || 0) * (ingredient.quantity / 100);
          dayTotals.saturated_fat += (ingredient.saturated_fat || 0) * (ingredient.quantity / 100);
          dayTotals.protein += (ingredient.protein || 0) * (ingredient.quantity / 100);
          dayTotals.carbohydrates += (ingredient.carbohydrates || 0) * (ingredient.quantity / 100);
          dayTotals.sugar += (ingredient.sugar || 0) * (ingredient.quantity / 100);
        });
      });

      totals[day] = dayTotals;
    });
    setNutritionTotals(totals);
  }, [selectedIngredients]);

  // Actualizar plan (PUT) con la lista de ingredientes
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
      ingredients: ingredientsList
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
                  <button
                    onClick={() => openModal(day, meal)}
                    className="btn btn-success btn-block mb-2"
                  >
                    + Añadir Ingrediente
                  </button>

                  {selectedIngredients[day] && selectedIngredients[day][meal] && (
                    <ul className="ingredient-list">
                      {selectedIngredients[day][meal].map((ingredient) => (
                        <li key={ingredient.id} className="ingredient-item">
                          {ingredient.name || `Ing #${ingredient.id}`} ({ingredient.quantity}g)
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

      <button onClick={savePlan} className="btn btn-primary">
        Guardar y Asignar Plan
      </button>

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
